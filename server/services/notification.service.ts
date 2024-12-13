// server/services/notification.service.ts
import { Notification } from '../models/Notification';
import { User } from '../models/User';
import { sendPushNotification } from './push.service';
import { sendEmail } from './email.service';
import { sendSms } from './sms.service';

interface NotificationData {
    userId: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    systemId?: string;
    plantId?: string;
}

export const createNotification = async (data: NotificationData) => {
    const notification = await Notification.create({
        ...data,
        timestamp: new Date()
    });

    const user = await User.findById(data.userId);
    if (!user) return;

    // Send push notification if enabled
    if (user.preferences.notifications.push) {
        await sendPushNotification(user.pushToken, {
            title: data.title,
            body: data.message
        });
    }

    // Send email if enabled
    if (user.preferences.notifications.email) {
        await sendEmail(user.email, {
            subject: data.title,
            text: data.message
        });
    }

    // Send SMS if enabled and notification is important
    if (user.preferences.notifications.sms && data.type === 'error') {
        await sendSms(user.phone, data.message);
    }

    return notification;
};
