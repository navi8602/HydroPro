// server/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new ApiError(401, 'Authentication required');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
        const user = await User.findById(decoded.userId);

        if (!user) {
            throw new ApiError(401, 'User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        next(new ApiError(401, 'Invalid token'));
    }
};
