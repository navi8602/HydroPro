// server/models/RentalContract.ts
import mongoose from 'mongoose';

const rentalContractSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    systemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'System',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    monthlyPrice: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    extensions: [{
        date: Date,
        months: Number,
        price: Number
    }]
}, {
    timestamps: true
});

export const RentalContract = mongoose.model('RentalContract', rentalContractSchema);
