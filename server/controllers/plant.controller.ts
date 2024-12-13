// server/controllers/plant.controller.ts
import { Request, Response, NextFunction } from 'express';
import { Plant } from '../models/Plant';
import { System } from '../models/System';
import { createNotification } from '../services/notification.service';
import { ApiError } from '../utils/ApiError';

export const plantController = {
    async addPlant(req: Request, res: Response, next: NextFunction) {
        try {
            const { systemId } = req.params;
            const { name, position } = req.body;

            const system = await System.findOne({
                _id: systemId,
                currentRentalId: { $exists: true },
                'currentRental.userId': req.user.id
            });

            if (!system) {
                throw new ApiError(404, 'System not found');
            }

            // Check if position is available
            const existingPlant = await Plant.findOne({
                systemId,
                position
            });

            if (existingPlant) {
                throw new ApiError(400, 'Position already occupied');
            }

            const plantedDate = new Date();
            const expectedHarvestDate = new Date();
            expectedHarvestDate.setDate(expectedHarvestDate.getDate() + 30); // Default 30 days

            const plant = await Plant.create({
                systemId,
                name,
                position,
                plantedDate,
                expectedHarvestDate
            });

            // Create notification
            await createNotification({
                userId: req.user.id,
                title: 'New Plant Added',
                message: `${name} has been added to your system`,
                type: 'success',
                systemId,
                plantId: plant._id
            });

            res.status(201).json(plant);
        } catch (error) {
            next(error);
        }
    },

    async getPlantGrowthData(req: Request, res: Response, next: NextFunction) {
        try {
            const { plantId } = req.params;
            const { timeRange } = req.query;

            const plant = await Plant.findById(plantId)
                .populate('systemId');

            if (!plant) {
                throw new ApiError(404, 'Plant not found');
            }

            if (plant.systemId.currentRental.userId.toString() !== req.user.id) {
                throw new ApiError(403, 'Not authorized');
            }

            const startDate = new Date();
            if (timeRange === '7d') {
                startDate.setDate(startDate.getDate() - 7);
            } else if (timeRange === '30d') {
                startDate.setDate(startDate.getDate() - 30);
            }

            const growthData = plant.growthData.filter(data =>
                data.date >= startDate
            );

            res.json(growthData);
        } catch (error) {
            next(error);
        }
    }
};
