import express from 'express';
import Joi from 'joi';
import Device from '../models/Device.js';
import Metric from '../models/Metric.js';
import Alert from '../models/Alert.js';
import { authRequired } from '../middleware/authMiddleware.js';
import { evaluateMetricsWithAI } from '../services/aiService.js';
import { broadcastToUser } from '../ws/websocket.js';

const router = express.Router();

const ingestSchema = Joi.object({
  cpuUsage: Joi.number().min(0).max(100).required(),
  memoryUsage: Joi.number().min(0).max(100).required(),
  diskUsage: Joi.number().min(0).max(100).required(),
  netRx: Joi.number().min(0).required(),
  netTx: Joi.number().min(0).required(),
  batteryLevel: Joi.number().min(0).max(100).allow(null),
  isCharging: Joi.boolean().allow(null),
  uptimeSeconds: Joi.number().min(0).required(),
  timestamp: Joi.date().optional()
});

// Endpoint called by monitoring agent using deviceToken in header
router.post('/ingest', async (req, res) => {
  try {
    const deviceToken = req.headers['x-device-token'];
    if (!deviceToken) {
      return res.status(401).json({ message: 'Missing device token' });
    }

    const device = await Device.findOne({ deviceToken });
    if (!device) {
      return res.status(401).json({ message: 'Unknown device token' });
    }

    const { error, value } = ingestSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const timestamp = value.timestamp ? new Date(value.timestamp) : new Date();

    // AI evaluation using offline-trained Isolation Forest model
    const aiResult = evaluateMetricsWithAI(value);

    const metric = await Metric.create({
      device: device._id,
      timestamp,
      cpuUsage: value.cpuUsage,
      memoryUsage: value.memoryUsage,
      diskUsage: value.diskUsage,
      netRx: value.netRx,
      netTx: value.netTx,
      batteryLevel: value.batteryLevel,
      isCharging: value.isCharging,
      uptimeSeconds: value.uptimeSeconds,
      anomalyScore: aiResult.anomalyScore,
      isAnomalous: aiResult.isAnomalous,
      healthScore: aiResult.healthScore,
      riskLevel: aiResult.riskLevel
    });

    device.lastSeenAt = new Date();
    device.status = 'online';
    device.lastHealthScore = aiResult.healthScore;
    device.lastRiskLevel = aiResult.riskLevel;
    await device.save();

    let alert = null;
    if (aiResult.isAnomalous || aiResult.healthScore < 70) {
      const severity =
        aiResult.riskLevel === 'High' ? 'High' : aiResult.riskLevel === 'Medium' ? 'Medium' : 'Low';
      alert = await Alert.create({
        device: device._id,
        type: 'Anomaly',
        message: `Anomalous behavior detected. Health score: ${aiResult.healthScore}, risk: ${aiResult.riskLevel}`,
        severity
      });
    }

    // Broadcast update to owning user dashboards
    broadcastToUser(device.owner, {
      type: 'METRIC_UPDATE',
      payload: {
        deviceId: device._id,
        metric: {
          id: metric._id,
          timestamp: metric.timestamp,
          cpuUsage: metric.cpuUsage,
          memoryUsage: metric.memoryUsage,
          diskUsage: metric.diskUsage,
          netRx: metric.netRx,
          netTx: metric.netTx,
          batteryLevel: metric.batteryLevel,
          isCharging: metric.isCharging,
          uptimeSeconds: metric.uptimeSeconds,
          anomalyScore: metric.anomalyScore,
          isAnomalous: metric.isAnomalous,
          healthScore: metric.healthScore,
          riskLevel: metric.riskLevel
        },
        alert: alert
          ? {
              id: alert._id,
              type: alert.type,
              message: alert.message,
              severity: alert.severity,
              createdAt: alert.createdAt
            }
          : null
      }
    });

    res.status(201).json({ message: 'Metric stored', healthScore: aiResult.healthScore });
  } catch (err) {
    console.error('Metric ingest error', err);
    res.status(500).json({ message: 'Failed to ingest metrics' });
  }
});

// Dashboard: get recent metrics for a device
router.get('/device/:deviceId/recent', authRequired, async (req, res) => {
  try {
    const device = await Device.findOne({ _id: req.params.deviceId, owner: req.user.id });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    const limit = Number(req.query.limit) || 100;

    const metrics = await Metric.find({ device: device._id })
      .sort({ timestamp: -1 })
      .limit(limit);

    res.json(
      metrics
        .map((m) => ({
          id: m._id,
          timestamp: m.timestamp,
          cpuUsage: m.cpuUsage,
          memoryUsage: m.memoryUsage,
          diskUsage: m.diskUsage,
          netRx: m.netRx,
          netTx: m.netTx,
          batteryLevel: m.batteryLevel,
          isCharging: m.isCharging,
          uptimeSeconds: m.uptimeSeconds,
          anomalyScore: m.anomalyScore,
          isAnomalous: m.isAnomalous,
          healthScore: m.healthScore,
          riskLevel: m.riskLevel
        }))
        .reverse()
    );
  } catch (err) {
    console.error('Get recent metrics error', err);
    res.status(500).json({ message: 'Failed to fetch metrics' });
  }
});

// Dashboard: recent alerts for all user devices
router.get('/alerts/recent', authRequired, async (req, res) => {
  try {
    const devices = await Device.find({ owner: req.user.id }).select('_id');
    const deviceIds = devices.map((d) => d._id);

    const alerts = await Alert.find({ device: { $in: deviceIds } })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('device', 'name model');

    res.json(
      alerts.map((a) => ({
        id: a._id,
        deviceId: a.device._id,
        deviceName: a.device.name,
        type: a.type,
        message: a.message,
        severity: a.severity,
        createdAt: a.createdAt
      }))
    );
  } catch (err) {
    console.error('Get alerts error', err);
    res.status(500).json({ message: 'Failed to fetch alerts' });
  }
});

export default router;

