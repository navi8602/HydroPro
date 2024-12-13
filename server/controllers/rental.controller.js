// server/controllers/rental.controller.js
import { rentalService } from '../services/rental/rental.service.js';
import { RentedSystem } from '../models/RentedSystem.js';
import { ApiError } from '../utils/ApiError.js';

export const rentalController = {
  async getRentedSystems(req, res, next) {
    try {
      const systems = await RentedSystem.find({
        userId: req.user.id,
        status: 'active'
      }).populate('plants');

      res.json(systems);
    } catch (error) {
      next(error);
    }
  },

  async rentSystem(req, res, next) {
    try {
      const { systemType, months } = req.body;
      const rental = await rentalService.createRental(
        req.user.id,
        systemType,
        months
      );

      res.status(201).json(rental);
    } catch (error) {
      next(error);
    }
  },

  async cancelRental(req, res, next) {
    try {
      const { rentalId } = req.params;
      const rental = await RentedSystem.findOne({
        _id: rentalId,
        userId: req.user.id
      });

      if (!rental) {
        throw new ApiError(404, 'Rental not found');
      }

      rental.status = 'cancelled';
      await rental.save();

      res.json({ message: 'Rental cancelled successfully' });
    } catch (error) {
      next(error);
    }
  }
};

