// server/models/Plant.js
import mongoose from 'mongoose';

const growthDataSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  height: Number,
  leafCount: Number,
  healthScore: Number,
  notes: String
});

const maintenanceRecordSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  type: {
    type: String,
    enum: ['watering', 'pruning', 'fertilizing', 'harvesting']
  },
  notes: String
});

const plantSchema = new mongoose.Schema({
  systemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'System',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  position: {
    type: Number,
    required: true
  },
  plantedDate: {
    type: Date,
    required: true
  },
  expectedHarvestDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['healthy', 'warning', 'critical'],
    default: 'healthy'
  },
  growthData: [growthDataSchema],
  maintenanceHistory: [maintenanceRecordSchema]
}, {
  timestamps: true
});

export const Plant = mongoose.model('Plant', plantSchema);
