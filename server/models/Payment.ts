// server/models/Payment.ts
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['rental', 'extension', 'refund'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    contractId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RentalContract'
    },
    stripePaymentIntentId: String,
    error: String,
    completedAt: Date
}, {
    timestamps: true
});

export const Payment = mongoose.model('Payment', paymentSchema);
