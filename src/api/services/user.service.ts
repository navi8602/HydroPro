// src/api/services/user.service.ts
import { api } from '../api';
import type { User, UserSettings } from '../../types/user';

export const UserService = {
    // Получение профиля пользователя
    getProfile: () =>
        api.get<User>('/users/profile'),

    // Обновление профиля
    updateProfile: (data: Partial<User>) =>
        api.put<User>('/users/profile', data),

    // Получение настроек пользователя
    getSettings: () =>
        api.get<UserSettings>('/users/settings'),

    // Обновление настроек
    updateSettings: (data: Partial<UserSettings>) =>
        api.put<UserSettings>('/users/settings', data),

    // Удаление аккаунта
    deleteAccount: () =>
        api.delete('/users/account')
};
