// server/services/notification/notification.service.ts
import { Notification } from '../../models/Notification';
import { User } from '../../models/User';
import { NotificationType } from '../../types/notification';

export class NotificationService {
    static async create(userId: string, data: {
        title: string;
        message: string;
        type: NotificationType;
        systemId?: string;
        plantId?: string;
    }) {
        return await Notification.create({
            userId,
            ...data,
            read: false,
            createdAt: new Date()
        });
    }

    static async markAsRead(userId: string, notificationId: string) {
        return await Notification.findOneAndUpdate(
            { _id: notificationId, userId },
            { read: true },
            { new: true }
        );
    }

    static async getUserNotifications(userId: string) {
        return await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .limit(50);
    }

    static async deleteNotification(userId: string, notificationId: string) {
        return await Notification.findOneAndDelete({ _id: notificationId, userId });
    }
}
