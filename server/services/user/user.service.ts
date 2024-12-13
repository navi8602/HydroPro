// server/services/user/user.service.ts
import { User } from '../../models/User';
import { hashPassword, comparePasswords } from '../../utils/auth';
import { EmailService } from '../email/email.service';
import { ApiError } from '../../utils/ApiError';

export class UserService {
    static async createUser(userData: any) {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new ApiError(400, 'User with this email already exists');
        }

        const hashedPassword = await hashPassword(userData.password);
        const user = await User.create({
            ...userData,
            password: hashedPassword
        });

        await EmailService.sendWelcomeEmail(user.email);
        return this.sanitizeUser(user);
    }

    static async updateProfile(userId: string, updates: any) {
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        return this.sanitizeUser(user);
    }

    static async updatePreferences(userId: string, preferences: any) {
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: { preferences } },
            { new: true }
        );

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        return user.preferences;
    }

    private static sanitizeUser(user: any) {
        const { password, ...sanitizedUser } = user.toObject();
        return sanitizedUser;
    }
}
