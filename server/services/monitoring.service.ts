// server/services/monitoring.service.ts
import { Plant } from '../models/Plant';
import { System } from '../models/System';
import { createNotification } from './notification.service';
import { SYSTEM_THRESHOLDS } from '../utils/constants';

export const monitoringService = {
    async checkSystemMetrics(systemId: string) {
        const system = await System.findById(systemId);
        if (!system) return;

        const { metrics } = system;
        const alerts = [];

        // Check temperature
        if (metrics.temperature < SYSTEM_THRESHOLDS.temperature.min) {
            alerts.push({
                type: 'warning',
                message: 'Temperature is too low'
            });
        } else if (metrics.temperature > SYSTEM_THRESHOLDS.temperature.max) {
            alerts.push({
                type: 'warning',
                message: 'Temperature is too high'
            });
        }

        // Check humidity
        if (metrics.humidity < SYSTEM_THRESHOLDS.humidity.min) {
            alerts.push({
                type: 'warning',
                message: 'Humidity is too low'
            });
        } else if (metrics.humidity > SYSTEM_THRESHOLDS.humidity.max) {
            alerts.push({
                type: 'warning',
                message: 'Humidity is too high'
            });
        }

        // Create notifications for alerts
        for (const alert of alerts) {
            await createNotification({
                userId: system.currentRental.userId,
                title: 'System Alert',
                message: alert.message,
                type: alert.type,
                systemId: system._id
            });
        }

        return alerts;
    },

    async checkPlantHealth(plantId: string) {
        const plant = await Plant.findById(plantId)
            .populate('systemId');

        if (!plant) return;

        const lastGrowthData = plant.growthData[plant.growthData.length - 1];
        if (!lastGrowthData) return;

        if (lastGrowthData.healthScore < 70) {
            await createNotification({
                userId: plant.systemId.currentRental.userId,
                title: 'Plant Health Alert',
                message: `${plant.name} health score is low (${lastGrowthData.healthScore}%)`,
                type: 'warning',
                systemId: plant.systemId._id,
                plantId: plant._id
            });
        }
    }
};
