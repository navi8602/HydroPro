// server/services/monitoring/system-monitoring.service.ts
import { SystemMetrics } from '../../models/SystemMetrics';
import { NotificationService } from '../notification/notification.service';
import { SYSTEM_THRESHOLDS } from '../../constants/monitoring';

export class SystemMonitoringService {
    static async recordMetrics(systemId: string, metrics: any) {
        const newMetrics = await SystemMetrics.create({
            systemId,
            ...metrics
        });

        await this.checkThresholds(systemId, metrics);
        return newMetrics;
    }

    static async getSystemMetricsHistory(systemId: string, dateRange: { start: Date; end: Date }) {
        return SystemMetrics.find({
            systemId,
            timestamp: { $gte: dateRange.start, $lte: dateRange.end }
        }).sort({ timestamp: 1 });
    }

    private static async checkThresholds(systemId: string, metrics: any) {
        const alerts = [];

        if (metrics.temperature < SYSTEM_THRESHOLDS.temperature.min ||
            metrics.temperature > SYSTEM_THRESHOLDS.temperature.max) {
            alerts.push({
                type: 'warning',
                message: `Temperature outside optimal range: ${metrics.temperature}°C`
            });
        }

        // Similar checks for other metrics...

        if (alerts.length > 0) {
            await NotificationService.createSystemAlert(systemId, alerts);
        }
    }
}
