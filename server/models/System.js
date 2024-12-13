// server/models/System.js
import mongoose from 'mongoose';

const systemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  systemType: {
    type: String,
    required: true,
    enum: ['hydropro-2000', 'hydropro-3000', 'hydropro-4000']
  },
  name: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  rentalPeriod: {
    type: Number,
    required: true,
    enum: [3, 6, 12]
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  metrics: {
    temperature: { type: Number, default: 22 },
    humidity: { type: Number, default: 60 },
    nutrientLevel: { type: Number, default: 100 },
    phLevel: { type: Number, default: 6.0 },
    lastUpdated: { type: Date, default: Date.now }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  maintenanceSchedule: [{
    type: { type: String, enum: ['cleaning', 'nutrientChange', 'calibration'] },
    date: Date,
    completed: { type: Boolean, default: false },
    notes: String
  }]
}, {
  timestamps: true
});

export const System = mongoose.model('System', systemSchema);
