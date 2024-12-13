// server/models/User.ts
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    preferences: {
        notifications: {
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true },
            sms: { type: Boolean, default: false }
        },
        language: { type: String, default: 'ru' },
        theme: { type: String, default: 'light' }
    },
    verificationCode: String,
    verificationCodeExpires: Date,
    isPhoneVerified: { type: Boolean, default: false },
    lastLogin: Date,
    status: {
        type: String,
        enum: ['active', 'suspended', 'deleted'],
        default: 'active'
    }
}, {
    timestamps: true
});

export const User = mongoose.model('User', userSchema);
