// server/models/Transaction.js
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  systemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'System'
  },
  type: {
    type: String,
    enum: ['payment', 'refund'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'RUB'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: {
      type: String,
      enum: ['card', 'bank'],
      required: true
    },
    last4: String,
    brand: String
  },
  description: String,
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

export const Transaction = mongoose.model('Transaction', transactionSchema);
