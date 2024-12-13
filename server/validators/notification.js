// server/validators/notification.js
import { body } from 'express-validator';

export const validateNotificationPreferences = [
  body('email')
    .isBoolean()
    .withMessage('Invalid email preference'),

  body('push')
    .isBoolean()
    .withMessage('Invalid push notification preference'),

  body('sms')
    .isBoolean()
    .withMessage('Invalid SMS preference')
];
