// server/models/SystemMetrics.ts
import mongoose from 'mongoose';

const systemMetricsSchema = new mongoose.Schema({
    systemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'System',
        required: true
    },
    temperature: {
        type: Number,
        required: true
    },
    humidity: {
        type: Number,
        required: true
    },
    phLevel: {
        type: Number,
        required: true
    },
    nutrientLevel: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

systemMetricsSchema.index({ systemId: 1, timestamp: -1 });

export const SystemMetrics = mongoose.model('SystemMetrics', systemMetricsSchema);
