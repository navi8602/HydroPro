// server/models/Notification.ts
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
    actionUrl: String,
    actionLabel: String
}, {
    timestamps: true
});

export const Notification = mongoose.model('Notification', notificationSchema);
