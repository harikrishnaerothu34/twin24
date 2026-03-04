import express from 'express';
import Joi from 'joi';
import Device from '../models/Device.js';
import { authRequired } from '../middleware/authMiddleware.js';

const router = express.Router();

const deviceCreateSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  model: Joi.string().min(2).max(200).required(),
  osInfo: Joi.string().max(200).optional()
});

router.post('/', authRequired, async (req, res) => {
  try {
    const { error, value } = deviceCreateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const device = await Device.create({
      owner: req.user.id,
      name: value.name,
      model: value.model,
      osInfo: value.osInfo
    });

    res.status(201).json({
      id: device._id,
      name: device.name,
      model: device.model,
      osInfo: device.osInfo,
      deviceToken: device.deviceToken
    });
  } catch (err) {
    console.error('Create device error', err);
    res.status(500).json({ message: 'Failed to create device' });
  }
});

router.get('/', authRequired, async (req, res) => {
  try {
    const devices = await Device.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(
      devices.map((d) => ({
        id: d._id,
        name: d.name,
        model: d.model,
        osInfo: d.osInfo,
        status: d.status,
        lastSeenAt: d.lastSeenAt,
        lastHealthScore: d.lastHealthScore,
        lastRiskLevel: d.lastRiskLevel
      }))
    );
  } catch (err) {
    console.error('List devices error', err);
    res.status(500).json({ message: 'Failed to list devices' });
  }
});

router.get('/:id', authRequired, async (req, res) => {
  try {
    const device = await Device.findOne({ _id: req.params.id, owner: req.user.id });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    res.json({
      id: device._id,
      name: device.name,
      model: device.model,
      osInfo: device.osInfo,
      status: device.status,
      lastSeenAt: device.lastSeenAt,
      lastHealthScore: device.lastHealthScore,
      lastRiskLevel: device.lastRiskLevel,
      deviceToken: device.deviceToken
    });
  } catch (err) {
    console.error('Get device error', err);
    res.status(500).json({ message: 'Failed to fetch device' });
  }
});

export default router;

