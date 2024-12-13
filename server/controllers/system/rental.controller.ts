// server/controllers/system/rent.controller.ts
import { Request, Response } from 'express';
import { System } from '../../models/System';
import { HYDROPONIC_SYSTEMS } from '../../constants/systems';
import { ApiError } from '../../utils/ApiError';

export const rentSystem = async (req: Request, res: Response) => {
    try {
        const { systemType, rentalPeriod } = req.body;
        const userId = req.user.id;

        // Validate system type
        const systemConfig = HYDROPONIC_SYSTEMS.find(s => s.id === systemType);
        if (!systemConfig) {
            throw new ApiError(400, 'Invalid system type');
        }

        // Validate rental period
        if (![3, 6, 12].includes(rentalPeriod)) {
            throw new ApiError(400, 'Invalid rental period');
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + rentalPeriod);

        const system = await System.create({
            userId,
            systemType,
            name: systemConfig.name,
            capacity: systemConfig.capacity,
            rentalPeriod,
            startDate,
            endDate
        });

        res.status(201).json({
            success: true,
            system
        });
    } catch (error) {
        next(error);
    }
};
