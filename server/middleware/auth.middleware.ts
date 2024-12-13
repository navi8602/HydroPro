// server/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { jwtConfig } from '../config/jwt.config';

export async function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new ApiError(401, 'Authentication required');
        }

        const decoded = jwt.verify(token, jwtConfig.secret) as { userId: string };
        const user = await User.findById(decoded.userId);

        if (!user) {
            throw new ApiError(401, 'User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        next(new ApiError(401, 'Invalid token'));
    }
}

export function authorize(...roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new ApiError(401, 'Authentication required');
        }

        if (roles.length && !roles.includes(req.user.role)) {
            throw new ApiError(403, 'Insufficient permissions');
        }

        next();
    };
}
