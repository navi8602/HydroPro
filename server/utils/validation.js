// server/utils/validation.js
import { validationResult } from 'express-validator';

export function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  }
  next();
}

export function sanitizePhone(phone) {
  return phone.replace(/\D/g, '');
}

export function validateMetrics(metrics) {
  const { temperature, humidity, nutrientLevel, phLevel } = metrics;

  return (
    isValidRange(temperature, -10, 50) &&
    isValidRange(humidity, 0, 100) &&
    isValidRange(nutrientLevel, 0, 100) &&
    isValidRange(phLevel, 0, 14)
  );
}

function isValidRange(value, min, max) {
  return typeof value === 'number' &&
    !isNaN(value) &&
    value >= min &&
    value <= max;
}
