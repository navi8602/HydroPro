// src/api/services/profile.service.ts
import { httpClient } from '../httpClient';
import type { User } from '../../types/user';

export const ProfileService = {
    async getUserProfile() {
        return httpClient.get<User>('/profile');
    },

    async updateProfile(data: Partial<User>) {
        return httpClient.put('/profile', data);
    },

    async updatePassword(currentPassword: string, newPassword: string) {
        return httpClient.put('/profile/password', {
            currentPassword,
            newPassword
        });
    },

    async updateNotificationSettings(settings: any) {
        return httpClient.put('/profile/notifications', settings);
    },

    async deleteAccount() {
        return httpClient.delete('/profile');
    }
};
