import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const deviceSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true }, // user friendly connection name
    model: { type: String, required: true, trim: true },
    osInfo: { type: String },
    deviceToken: { type: String, required: true, unique: true, default: () => uuidv4() },
    lastSeenAt: { type: Date },
    status: { type: String, enum: ['online', 'offline'], default: 'offline' },
    lastHealthScore: { type: Number, min: 0, max: 100 },
    lastRiskLevel: { type: String, enum: ['Low', 'Medium', 'High'] }
  },
  { timestamps: true }
);

const Device = mongoose.model('Device', deviceSchema);

export default Device;

