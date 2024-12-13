// server/controllers/notification.controller.js
import { Notification } from '../models/Notification.js';
import { notificationService } from '../services/notification/notification.service.js';

export const notificationController = {
  async getNotifications(req, res, next) {
    try {
      const notifications = await Notification.find({
        userId: req.user.id,
        read: false
      }).sort('-createdAt');

      res.json(notifications);
    } catch (error) {
      next(error);
    }
  },

  async markAsRead(req, res, next) {
    try {
      const { notificationId } = req.params;
      await Notification.findByIdAndUpdate(notificationId, {
        read: true
      });

      res.json({ message: 'Notification marked as read' });
    } catch (error) {
      next(error);
    }
  },

  async updateNotificationPreferences(req, res, next) {
    try {
      const { preferences } = req.body;
      await notificationService.updatePreferences(req.user.id, preferences);

      res.json({ message: 'Notification preferences updated' });
    } catch (error) {
      next(error);
    }
  }
};
