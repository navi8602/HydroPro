// server/validators/auth.js
import { body } from 'express-validator';

export const validatePhone = [
  body('phone')
    .matches(/^\+7\d{10}$/)
    .withMessage('Invalid phone number format')
];

export const validateCode = [
  body('phone')
    .matches(/^\+7\d{10}$/)
    .withMessage('Invalid phone number format'),

  body('code')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('Invalid verification code')
];
