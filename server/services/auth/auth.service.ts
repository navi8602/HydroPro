// server/services/auth/auth.service.ts
import jwt from 'jsonwebtoken';
import { User } from '../../models/User';
import { TokenService } from './token.service';
import { PasswordService } from './password.service';

export class AuthService {
    constructor(
        private tokenService: TokenService,
        private passwordService: PasswordService
    ) {}

    async generateTokens(user: User) {
        const accessToken = await this.tokenService.generateAccessToken(user);
        const refreshToken = await this.tokenService.generateRefreshToken(user);
        return { accessToken, refreshToken };
    }

    async verifyPassword(plainPassword: string, hashedPassword: string) {
        return this.passwordService.verify(plainPassword, hashedPassword);
    }

    async hashPassword(password: string) {
        return this.passwordService.hash(password);
    }
}
