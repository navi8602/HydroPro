// server/services/monitoring/plant-monitoring.service.ts
import { PlantMetrics } from '../../models/PlantMetrics';
import { NotificationService } from '../notification/notification.service';
import { Plant } from '../../models/Plant';

export class PlantMonitoringService {
    static async recordGrowthData(plantId: string, data: any) {
        const plant = await Plant.findById(plantId);
        if (!plant) {
            throw new Error('Plant not found');
        }

        const metrics = await PlantMetrics.create({
            plantId,
            ...data
        });

        await this.analyzeGrowthData(plantId, data);
        return metrics;
    }

    static async getGrowthHistory(plantId: string, dateRange: { start: Date; end: Date }) {
        return PlantMetrics.find({
            plantId,
            timestamp: { $gte: dateRange.start, $lte: dateRange.end }
        }).sort({ timestamp: 1 });
    }

    private static async analyzeGrowthData(plantId: string, data: any) {
        const plant = await Plant.findById(plantId).populate('systemId');
        const previousMetrics = await PlantMetrics.findOne({ plantId })
            .sort({ timestamp: -1 })
            .skip(1);

        if (previousMetrics) {
            // Check growth rate
            const growthRate = (data.height - previousMetrics.height) /
                ((data.timestamp - previousMetrics.timestamp) / (24 * 60 * 60 * 1000));

            if (growthRate < plant.expectedGrowthRate * 0.7) {
                await NotificationService.createPlantAlert(plantId, {
                    type: 'warning',
                    message: 'Plant growth rate is below expected'
                });
            }
        }
    }
}
