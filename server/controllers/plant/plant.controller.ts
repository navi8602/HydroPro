// server/controllers/plant/plant.controller.ts
import { Request, Response } from 'express';
import { PlantService } from '../../services/plant.service';
import { SystemService } from '../../services/system.service';
import { NotificationService } from '../../services/notification.service';
import { ApiError } from '../../utils/ApiError';

export class PlantController {
    constructor(
        private plantService: PlantService,
        private systemService: SystemService,
        private notificationService: NotificationService
    ) {}

    async addPlant(req: Request, res: Response) {
        const { systemId } = req.params;
        const { name, position } = req.body;
        const userId = req.user.id;

        // Проверяем доступ к системе
        const system = await this.systemService.getUserSystem(userId, systemId);
        if (!system) {
            throw new ApiError(404, 'System not found');
        }

        // Проверяем доступность позиции
        const isPositionAvailable = await this.plantService.checkPosition(systemId, position);
        if (!isPositionAvailable) {
            throw new ApiError(400, 'Position already occupied');
        }

        // Создаем растение
        const plant = await this.plantService.createPlant({
            systemId,
            name,
            position
        });

        // Отправляем уведомление
        await this.notificationService.sendPlantAddedNotification(userId, system.id, plant);

        res.status(201).json(plant);
    }

    async updateGrowthData(req: Request, res: Response) {
        const { plantId } = req.params;
        const { height, leafCount, healthScore } = req.body;
        const userId = req.user.id;

        const plant = await this.plantService.getPlantWithSystem(plantId);
        if (!plant || plant.system.userId.toString() !== userId) {
            throw new ApiError(404, 'Plant not found');
        }

        const updatedPlant = await this.plantService.updateGrowthData(plantId, {
            height,
            leafCount,
            healthScore
        });

        // Проверяем необходимость уведомлений
        await this.plantService.checkPlantHealth(updatedPlant);

        res.json(updatedPlant);
    }
}
