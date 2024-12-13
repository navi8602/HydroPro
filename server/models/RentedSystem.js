// server/models/RentedSystem.js
import mongoose from 'mongoose';

const rentedSystemSchema = new mongoose.Schema({
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
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  rentalPeriod: {
    type: Number,
    required: true,
    enum: [3, 6, 12]
  },
  price: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

export const RentedSystem = mongoose.model('RentedSystem', rentedSystemSchema);
