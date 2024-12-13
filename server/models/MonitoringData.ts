// server/models/MonitoringData.ts
import mongoose from 'mongoose';

const monitoringDataSchema = new mongoose.Schema({
    systemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'System',
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    metrics: {
        temperature: Number,
        humidity: Number,
        lightLevel: Number,
        phLevel: Number,
        nutrientLevel: Number,
        waterLevel: Number,
        powerConsumption: Number
    },
    alerts: [{
        type: String,
        message: String,
        severity: {
            type: String,
            enum: ['info', 'warning', 'critical']
        }
    }]
}, {
    timestamps: true
});

// Индекс для эффективного поиска по временным рядам
monitoringDataSchema.index({ systemId: 1, timestamp: -1 });

export const MonitoringData = mongoose.model('MonitoringData', monitoringDataSchema);
