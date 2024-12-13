// server/validators/system.ts
import { body } from 'express-validator';

export const validateSystemRental = [
    body('systemId')
        .isMongoId()
        .withMessage('Invalid system ID'),

    body('months')
        .isInt({ min: 3, max: 12 })
        .withMessage('Rental period must be between 3 and 12 months')
];

export const validateMetricsUpdate = [
    body('metrics.temperature')
        .isFloat({ min: 15, max: 35 })
        .withMessage('Temperature must be between 15°C and 35°C'),

    body('metrics.humidity')
        .isFloat({ min: 30, max: 90 })
        .withMessage('Humidity must be between 30% and 90%'),

    body('metrics.nutrientLevel')
        .isFloat({ min: 0, max: 100 })
        .withMessage('Nutrient level must be between 0 and 100'),

    body('metrics.phLevel')
        .isFloat({ min: 5.5, max: 7.5 })
        .withMessage('pH level must be between 5.5 and 7.5')
];
