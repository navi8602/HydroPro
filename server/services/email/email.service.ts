// server/services/email/email.service.ts
import nodemailer from 'nodemailer';
import { emailConfig } from '../../config/email.config';

export class EmailService {
    private static transporter = nodemailer.createTransport(emailConfig);

    static async sendNotificationEmail(to: string, notification: any) {
        const { subject, text } = this.getNotificationEmailContent(notification);

        await this.transporter.sendMail({
            from: emailConfig.from,
            to,
            subject,
            text
        });
    }

    private static getNotificationEmailContent(notification: any) {
        // Template logic for different notification types
        switch (notification.type) {
            case 'system_alert':
                return {
                    subject: 'System Alert - Action Required',
                    text: `Alert: ${notification.message}`
                };
            case 'plant_alert':
                return {
                    subject: 'Plant Care Alert',
                    text: `Alert: ${notification.message}`
                };
            default:
                return {
                    subject: 'Notification',
                    text: notification.message
                };
        }
    }
}
