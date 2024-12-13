// server/models/Notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info'
  },
  systemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'System'
  },
  plantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant'
  },
  read: {
    type: Boolean,
    default: false
  },
  actionLabel: String,
  actionUrl: String,
  expiresAt: Date
}, {
  timestamps: true
});

// Автоматическое удаление прочитанных уведомлений через 30 дней
notificationSchema.index({ createdAt: 1 }, {
  expireAfterSeconds: 30 * 24 * 60 * 60,
  partialFilterExpression: { read: true }
});

export const Notification = mongoose.model('Notification', notificationSchema);
