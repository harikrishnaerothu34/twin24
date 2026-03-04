import mongoose from 'mongoose';

const metricSchema = new mongoose.Schema(
  {
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true, index: true },
    timestamp: { type: Date, required: true, index: true },
    cpuUsage: { type: Number, required: true }, // percentage 0-100
    memoryUsage: { type: Number, required: true }, // percentage 0-100
    diskUsage: { type: Number, required: true }, // percentage 0-100
    netRx: { type: Number, required: true }, // KB/s
    netTx: { type: Number, required: true }, // KB/s
    batteryLevel: { type: Number }, // 0-100 or null for desktop
    isCharging: { type: Boolean },
    uptimeSeconds: { type: Number, required: true },
    anomalyScore: { type: Number },
    isAnomalous: { type: Boolean },
    healthScore: { type: Number },
    riskLevel: { type: String, enum: ['Low', 'Medium', 'High'] }
  },
  { timestamps: true }
);

const Metric = mongoose.model('Metric', metricSchema);

export default Metric;

