// server/controllers/auth/login.controller.ts
import { Request, Response } from 'express';
import { User } from '../../models/User';
import { comparePasswords, generateTokens } from '../../utils/auth';
import { ApiError } from '../../utils/ApiError';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(401, 'Invalid credentials');
        }

        const isPasswordValid = await comparePasswords(password, user.password);
        if (!isPasswordValid) {
            throw new ApiError(401, 'Invalid credentials');
        }

        const { accessToken, refreshToken } = generateTokens(user);

        // Update refresh token
        user.refreshToken = refreshToken;
        await user.save();

        res.json({
            success: true,
            tokens: { accessToken, refreshToken },
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
};
