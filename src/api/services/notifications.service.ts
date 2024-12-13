import { api } from '../api';
import { Notification } from '../../contexts/NotificationContext';

export const NotificationsService = {
    async getNotifications(): Promise<Notification[]> {
        const { data } = await api.get<Notification[]>('/notifications');
        return data;
    },

    async markAsRead(notificationId: string): Promise<void> {
        await api.put(`/notifications/${notificationId}/read`);
    },

    async deleteNotification(notificationId: string): Promise<void> {
        await api.delete(`/notifications/${notificationId}`);
    }
};
