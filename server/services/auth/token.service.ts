// server/services/auth/token.service.ts
import jwt from 'jsonwebtoken';
import { User } from '../../models/User';
import { config } from '../../config';

export class TokenService {
    async generateAccessToken(user: User) {
        return jwt.sign(
            { userId: user._id },
            config.jwt.accessSecret,
            { expiresIn: '15m' }
        );
    }

    async generateRefreshToken(user: User) {
        return jwt.sign(
            { userId: user._id },
            config.jwt.refreshSecret,
            { expiresIn: '7d' }
        );
    }

    async verifyToken(token: string, secret: string) {
        return jwt.verify(token, secret);
    }
}
