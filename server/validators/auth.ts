// server/validators/auth.ts
import { body } from 'express-validator';

export const validateRegistration = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format'),

    body('phone')
        .trim()
        .notEmpty()
        .withMessage('Phone is required')
        .matches(/^\+?[1-9]\d{10,14}$/)
        .withMessage('Invalid phone format'),

    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
];

export const validateLogin = [
    body('phone')
        .trim()
        .notEmpty()
        .withMessage('Phone is required'),

    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
];
