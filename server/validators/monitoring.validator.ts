// server/validators/monitoring.validator.ts
import { body, query } from 'express-validator';
import { SYSTEM_THRESHOLDS } from '../constants/monitoring';

export const systemMetricsValidator = [
    body('temperature')
        .isFloat({ min: SYSTEM_THRESHOLDS.temperature.min - 5, max: SYSTEM_THRESHOLDS.temperature.max + 5 })
        .withMessage('Invalid temperature value'),

    body('humidity')
        .isFloat({ min: SYSTEM_THRESHOLDS.humidity.min - 5, max: SYSTEM_THRESHOLDS.humidity.max + 5 })
        .withMessage('Invalid humidity value'),

    body('phLevel')
        .isFloat({ min: SYSTEM_THRESHOLDS.phLevel.min - 0.5, max: SYSTEM_THRESHOLDS.phLevel.max + 0.5 })
        .withMessage('Invalid pH level'),

    body('nutrientLevel')
        .isFloat({ min: 0, max: 100 })
        .withMessage('Invalid nutrient level')
];

export const plantMetricsValidator = [
    body('height')
        .isFloat({ min: 0 })
        .withMessage('Height must be positive'),

    body('leafCount')
        .isInt({ min: 0 })
        .withMessage('Leaf count must be positive'),

    body('healthScore')
        .isFloat({ min: 0, max: 100 })
        .withMessage('Health score must be between 0 and 100'),

    body('notes')
        .optional()
        .isString()
        .trim()
        .isLength({ max: 500 })
];

export const dateRangeValidator = [
    query('start')
        .isISO8601()
        .withMessage('Invalid start date'),

    query('end')
        .isISO8601()
        .withMessage('Invalid end date')
];
