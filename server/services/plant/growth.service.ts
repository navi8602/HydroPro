// server/services/plant/growth.service.ts
import { PlantGrowthData } from '../../models/PlantGrowthData';
import { AlertsService } from '../monitoring/alerts.service';

export class GrowthService {
    constructor(private alertsService: AlertsService) {}

    async addGrowthData(plantId: string, data: {
        height: number;
        leafCount: number;
        healthScore: number;
    }) {
        const growthData = await PlantGrowthData.create({
            plantId,
            ...data,
            timestamp: new Date()
        });

        await this.checkGrowthAnomalies(plantId, growthData);
        return growthData;
    }

    async getGrowthHistory(plantId: string) {
        return PlantGrowthData.find({ plantId })
            .sort({ timestamp: 1 });
    }

    private async checkGrowthAnomalies(plantId: string, currentData: any) {
        const previousData = await PlantGrowthData.find({ plantId })
            .sort({ timestamp: -1 })
            .limit(2);

        if (previousData.length < 2) return;

        const growthRate = this.calculateGrowthRate(
            previousData[1],
            previousData[0],
            currentData
        );

        if (this.isAnomalousGrowth(growthRate)) {
            await this.alertsService.createAlert({
                systemId: currentData.systemId,
                type: 'growth_anomaly',
                message: 'Обнаружено аномальное изменение в росте растения',
                severity: 'warning'
            });
        }
    }

    private calculateGrowthRate(prev2: any, prev1: any, current: any) {
        // Логика расчета скорости роста
        return {
            height: (current.height - prev1.height) / (prev1.height - prev2.height),
            leafCount: (current.leafCount - prev1.leafCount) / (prev1.leafCount - prev2.leafCount)
        };
    }

    private isAnomalousGrowth(rate: any) {
        const THRESHOLD = 1.5; // 50% отклонение
        return Math.abs(rate.height - 1) > THRESHOLD ||
            Math.abs(rate.leafCount - 1) > THRESHOLD;
    }
}
