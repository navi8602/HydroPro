// server/validators/rental.js
import { body } from 'express-validator';
import { HYDROPONIC_SYSTEMS } from '../constants/systems.js';

export const validateRental = [
  body('systemType')
    .isIn(HYDROPONIC_SYSTEMS.map(s => s.id))
    .withMessage('Invalid system type'),

  body('months')
    .isIn([3, 6, 12])
    .withMessage('Invalid rental period')
];
