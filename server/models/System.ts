// server/models/System.ts
import mongoose from 'mongoose';

const systemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true,
        enum: ['hydropro-2000', 'hydropro-3000', 'hydropro-4000']
    },
    capacity: {
        type: Number,
        required: true
    },
    monthlyPrice: {
        type: Number,
        required: true
    },
    specifications: {
        powerConsumption: Number,
        waterCapacity: Number,
        lightingType: String,
        automationLevel: {
            type: String,
            enum: ['basic', 'advanced', 'professional']
        }
    },
    status: {
        type: String,
        enum: ['available', 'rented', 'maintenance'],
        default: 'available'
    },
    currentRentalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RentalContract'
    },
    maintenanceHistory: [{
        date: Date,
        type: String,
        description: String,
        technician: String
    }],
    metrics: {
        temperature: Number,
        humidity: Number,
        nutrientLevel: Number,
        phLevel: Number,
        lastUpdated: Date
    }
}, {
    timestamps: true
});

export const System = mongoose.model('System', systemSchema);
