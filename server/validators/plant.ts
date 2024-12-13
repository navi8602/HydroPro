// server/validators/plant.ts
import { body } from 'express-validator';

export const validatePlantAddition = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Plant name is required'),

    body('position')
        .isInt({ min: 1 })
        .withMessage('Position must be a positive integer'),

    body('expectedHarvestDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid harvest date format')
];

export const validateGrowthData = [
    body('height')
        .isFloat({ min: 0 })
        .withMessage('Height must be a positive number'),

    body('leafCount')
        .isInt({ min: 0 })
        .withMessage('Leaf count must be a positive integer'),

    body('healthScore')
        .isFloat({ min: 0, max: 100 })
        .withMessage('Health score must be between 0 and 100')
];
