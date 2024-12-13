// server/services/rental/rental.service.js
import { RentedSystem } from '../../models/RentedSystem.js';
import { calculatePrice } from '../../utils/rental.js';
import { notificationService } from '../notification/notification.service.js';

export const rentalService = {
  async createRental(userId, systemType, months) {
    const price = calculatePrice(systemType, months);

    const rental = await RentedSystem.create({
      userId,
      systemType,
      rentalPeriod: months,
      startDate: new Date(),
      endDate: this.calculateEndDate(months),
      price,
      status: 'active'
    });

    await notificationService.createNotification(userId, {
      type: 'system_rented',
      title: 'Система арендована',
      message: `Вы успешно арендовали систему ${systemType}`,
      systemId: rental._id
    });

    return rental;
  },

  calculateEndDate(months) {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date;
  },

  async checkExpiringRentals() {
    const soon = new Date();
    soon.setDate(soon.getDate() + 7);

    const expiringRentals = await RentedSystem.find({
      status: 'active',
      endDate: { $lte: soon }
    });

    for (const rental of expiringRentals) {
      await notificationService.createNotification(rental.userId, {
        type: 'rental_expiring',
        title: 'Срок аренды истекает',
        message: `Срок аренды системы истекает через ${this.getDaysRemaining(rental.endDate)} дней`,
        systemId: rental._id
      });
    }
  },

  getDaysRemaining(endDate) {
    const diff = endDate.getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
};
