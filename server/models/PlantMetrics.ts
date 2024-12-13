// server/models/PlantMetrics.ts
import mongoose from 'mongoose';

const plantMetricsSchema = new mongoose.Schema({
    plantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plant',
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    leafCount: {
        type: Number,
        required: true
    },
    healthScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    notes: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

plantMetricsSchema.index({ plantId: 1, timestamp: -1 });

export const PlantMetrics = mongoose.model('PlantMetrics', plantMetricsSchema);
