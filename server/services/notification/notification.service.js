// server/services/notification/notification.service.js
import { Notification } from '../../models/Notification.js';
import { User } from '../../models/User.js';
import { sendPushNotification } from '../../utils/push.js';
import { sendEmail } from '../../utils/email.js';

export const notificationService = {
  async createNotification(userId, data) {
    const notification = await Notification.create({
      userId,
      ...data,
      createdAt: new Date()
    });

    await this.sendNotification(userId, notification);
    return notification;
  },

  async sendNotification(userId, notification) {
    const user = await User.findById(userId);
    const { preferences } = user;

    if (preferences.notifications.push) {
      await sendPushNotification(user.pushToken, notification);
    }

    if (preferences.notifications.email) {
      await sendEmail(user.email, notification);
    }
  },

  async updatePreferences(userId, preferences) {
    return User.findByIdAndUpdate(userId, {
      'preferences.notifications': preferences
    }, { new: true });
  }
};
