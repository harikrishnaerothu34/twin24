import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true, index: true },
    type: {
      type: String,
      enum: ['Anomaly', 'HealthDegradation', 'Offline', 'BackToNormal'],
      required: true
    },
    message: { type: String, required: true },
    severity: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;

