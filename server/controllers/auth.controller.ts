// server/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { generateToken, hashPassword, comparePasswords } from '../utils/auth';
import { sendSmsCode } from '../services/sms.service';
import { ApiError } from '../utils/ApiError';

export const authController = {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, phone, password } = req.body;

            // Check if user exists
            const existingUser = await User.findOne({
                $or: [{ email }, { phone }]
            });

            if (existingUser) {
                throw new ApiError(400, 'User already exists');
            }

            // Generate verification code
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

            // Create user
            const hashedPassword = await hashPassword(password);
            const user = await User.create({
                name,
                email,
                phone,
                password: hashedPassword,
                verificationCode,
                verificationCodeExpires
            });

            // Send SMS code
            await sendSmsCode(phone, verificationCode);

            res.status(201).json({
                message: 'Verification code sent to your phone',
                userId: user._id
            });
        } catch (error) {
            next(error);
        }
    },

    async verifyPhone(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, code } = req.body;

            const user = await User.findById(userId);
            if (!user) {
                throw new ApiError(404, 'User not found');
            }

            if (user.verificationCode !== code) {
                throw new ApiError(400, 'Invalid verification code');
            }

            if (new Date() > user.verificationCodeExpires) {
                throw new ApiError(400, 'Verification code expired');
            }

            user.isPhoneVerified = true;
            user.verificationCode = undefined;
            user.verificationCodeExpires = undefined;
            await user.save();

            const token = generateToken(user._id);

            res.json({
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                }
            });
        } catch (error) {
            next(error);
        }
    },

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { phone, password } = req.body;

            const user = await User.findOne({ phone });
            if (!user) {
                throw new ApiError(401, 'Invalid credentials');
            }

            const isPasswordValid = await comparePasswords(password, user.password);
            if (!isPasswordValid) {
                throw new ApiError(401, 'Invalid credentials');
            }

            const token = generateToken(user._id);

            user.lastLogin = new Date();
            await user.save();

            res.json({
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                }
            });
        } catch (error) {
            next(error);
        }
    }
};
