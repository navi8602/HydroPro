// server/utils/rental.js
import { HYDROPONIC_SYSTEMS } from '../constants/systems.js';

export function calculatePrice(systemType, months) {
  const system = HYDROPONIC_SYSTEMS.find(s => s.id === systemType);
  if (!system) throw new Error('Invalid system type');

  const basePrice = system.monthlyPrice * months;
  const discount = getDiscount(months);

  return {
    basePrice,
    discount: basePrice * discount,
    finalPrice: basePrice * (1 - discount)
  };
}

function getDiscount(months) {
  switch (months) {
    case 6: return 0.1;  // 10% discount
    case 12: return 0.2; // 20% discount
    default: return 0;
  }
}

export function validateSystemAvailability(systemType, startDate) {
  // Проверка доступности системы на указанную дату
  return true; // Заглушка
}
