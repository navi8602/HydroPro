// server/services/notification/notification.service.ts
import { Notification } from '../../models/Notification';
import { WebSocketService } from '../websocket/websocket.service';
import { EmailService } from '../email/email.service';

export class NotificationService {
    static async createSystemAlert(systemId: string, alerts: any[]) {
        const notifications = await Promise.all(
            alerts.map(alert =>
                Notification.create({
                    type: 'system_alert',
                    systemId,
                    ...alert
                })
            )
        );

        // Send real-time notifications
        notifications.forEach(notification => {
            WebSocketService.sendNotification(notification);
        });

        return notifications;
    }

    static async createPlantAlert(plantId: string, alert: any) {
        const notification = await Notification.create({
            type: 'plant_alert',
            plantId,
            ...alert
        });

        WebSocketService.sendNotification(notification);
        return notification;
    }

    static async getUserNotifications(userId: string) {
        return Notification.find({ userId })
            .sort({ createdAt: -1 })
            .limit(50);
    }

    static async markAsRead(userId: string, notificationId: string) {
        return Notification.findOneAndUpdate(
            { _id: notificationId, userId },
            { read: true },
            { new: true }
        );
    }

    static async markAllAsRead(userId: string) {
        return Notification.updateMany(
            { userId, read: false },
            { read: true }
        );
    }
}
