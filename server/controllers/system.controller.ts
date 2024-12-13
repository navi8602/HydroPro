// server/controllers/system.controller.ts
import { Request, Response, NextFunction } from 'express';
import { System } from '../models/System';
import { RentalContract } from '../models/RentalContract';
import { Payment } from '../models/Payment';
import { createPaymentIntent } from '../services/payment.service';
import { ApiError } from '../utils/ApiError';

export const systemController = {
    async getRentedSystems(req: Request, res: Response, next: NextFunction) {
        try {
            const systems = await RentalContract.find({
                userId: req.user.id,
                status: 'active'
            })
                .populate('systemId')
                .sort('-createdAt');

            res.json(systems);
        } catch (error) {
            next(error);
        }
    },

    async rentSystem(req: Request, res: Response, next: NextFunction) {
        try {
            const { systemId, months } = req.body;

            const system = await System.findById(systemId);
            if (!system) {
                throw new ApiError(404, 'System not found');
            }

            if (system.status !== 'available') {
                throw new ApiError(400, 'System is not available for rent');
            }

            const totalPrice = system.monthlyPrice * months;

            // Create payment intent
            const paymentIntent = await createPaymentIntent(totalPrice);

            // Create rental contract
            const contract = await RentalContract.create({
                userId: req.user.id,
                systemId: system._id,
                startDate: new Date(),
                endDate: new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000),
                monthlyPrice: system.monthlyPrice,
                totalPrice
            });

            // Create payment record
            await Payment.create({
                userId: req.user.id,
                amount: totalPrice,
                type: 'rental',
                contractId: contract._id,
                stripePaymentIntentId: paymentIntent.id
            });

            // Update system status
            system.status = 'rented';
            system.currentRentalId = contract._id;
            await system.save();

            res.status(201).json({
                contract,
                clientSecret: paymentIntent.client_secret
            });
        } catch (error) {
            next(error);
        }
    },

    async getSystemMetrics(req: Request, res: Response, next: NextFunction) {
        try {
            const { systemId } = req.params;

            const system = await System.findOne({
                _id: systemId,
                currentRentalId: { $exists: true },
                'currentRental.userId': req.user.id
            });

            if (!system) {
                throw new ApiError(404, 'System not found');
            }

            res.json(system.metrics);
        } catch (error) {
            next(error);
        }
    }
};
