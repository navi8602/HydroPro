// server/controllers/plant/add.controller.ts
import { Request, Response } from 'express';
import { Plant } from '../../models/Plant';
import { System } from '../../models/System';
import { PLANTS } from '../../constants/plants';
import { ApiError } from '../../utils/ApiError';
import { checkPlantCompatibility } from '../../utils/plantCompatibility';

export const addPlant = async (req: Request, res: Response) => {
    try {
        const { systemId } = req.params;
        const { name, position } = req.body;
        const userId = req.user.id;

        // Check system ownership
        const system = await System.findOne({ _id: systemId, userId });
        if (!system) {
            throw new ApiError(404, 'System not found');
        }

        // Validate plant type
        const plantConfig = PLANTS.find(p => p.name === name);
        if (!plantConfig) {
            throw new ApiError(400, 'Invalid plant type');
        }

        // Check position availability
        const existingPlant = await Plant.findOne({ systemId, position });
        if (existingPlant) {
            throw new ApiError(400, 'Position already occupied');
        }

        // Check compatibility with existing plants
        const systemPlants = await Plant.find({ systemId });
        const isCompatible = checkPlantCompatibility(systemPlants, plantConfig.id);
        if (!isCompatible) {
            throw new ApiError(400, 'Plant is not compatible with existing plants');
        }

        const plantedDate = new Date();
        const expectedHarvestDate = new Date();
        expectedHarvestDate.setDate(expectedHarvestDate.getDate() + plantConfig.growthDays);

        const plant = await Plant.create({
            systemId,
            name,
            position,
            plantedDate,
            expectedHarvestDate
        });

        res.status(201).json({
            success: true,
            plant
        });
    } catch (error) {
        next(error);
    }
};
