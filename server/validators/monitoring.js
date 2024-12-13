// server/validators/monitoring.js
import { body } from 'express-validator';

export const validateGrowthData = [
  body('height')
    .isFloat({ min: 0, max: 300 })
    .withMessage('Invalid height value'),

  body('leafCount')
    .isInt({ min: 0, max: 100 })
    .withMessage('Invalid leaf count'),

  body('healthScore')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Invalid health score'),

  body('notes')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
];
