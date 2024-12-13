// server/services/profile/profile.service.ts
import { User } from '../../models/User';
import { System } from '../../models/System';
import { Plant } from '../../models/Plant';

export class ProfileService {
    static async getUserProfile(userId: string) {
        const user = await User.findById(userId).select('-password -refreshToken');
        if (!user) throw new Error('User not found');

        const systems = await System.find({ userId });
        const systemIds = systems.map(s => s._id);
        const plants = await Plant.find({ systemId: { $in: systemIds } });

        return {
            user,
            statistics: {
                totalSystems: systems.length,
                activePlants: plants.length,
                successfulHarvests: plants.filter(p => p.status === 'harvested').length
            }
        };
    }

    static async updateProfile(userId: string, data: {
        name?: string;
        phone?: string;
        address?: string;
        preferences?: any;
    }) {
        return await User.findByIdAndUpdate(
            userId,
            { $set: data },
            { new: true, runValidators: true }
        ).select('-password -refreshToken');
    }

    static async updateNotificationPreferences(userId: string, preferences: {
        email: boolean;
        push: boolean;
        sms: boolean;
    }) {
        return await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    'preferences.notifications': preferences
                }
            },
            { new: true }
        ).select('-password -refreshToken');
    }
}
