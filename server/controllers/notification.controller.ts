// server/controllers/notification.controller.ts
import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification/notification.service';

export class NotificationController {
    static async getUserNotifications(req: Request, res: Response, next: NextFunction) {
        try {
            const notifications = await NotificationService.getUserNotifications(req.user.id);
            res.json(notifications);
        } catch (error) {
            next(error);
        }
    }

    static async markAsRead(req: Request, res: Response, next: NextFunction) {
        try {
            const { notificationId } = req.params;
            const notification = await NotificationService.markAsRead(
                req.user.id,
                notificationId
            );
            res.json(notification);
        } catch (error) {
            next(error);
        }
    }

    static async markAllAsRead(req: Request, res: Response, next: NextFunction) {
        try {
            await NotificationService.markAllAsRead(req.user.id);
            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    }

    static async deleteNotification(req: Request, res: Response, next: NextFunction) {
        try {
            const { notificationId } = req.params;
            await NotificationService.deleteNotification(req.user.id, notificationId);
            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    }
}
