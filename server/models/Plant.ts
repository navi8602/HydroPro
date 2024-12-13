// server/models/Plant.ts
import mongoose from 'mongoose';

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
    growthData: [{
        date: Date,
        height: Number,
        leafCount: Number,
        healthScore: Number,
        notes: String
    }],
    maintenanceHistory: [{
        date: Date,
        type: {
            type: String,
            enum: ['watering', 'pruning', 'fertilizing', 'harvesting']
        },
        notes: String
    }]
}, {
    timestamps: true
});

export const Plant = mongoose.model('Plant', plantSchema);
