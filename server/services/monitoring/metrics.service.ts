// server/services/monitoring/metrics.service.ts
import { SystemMetrics } from '../../models/SystemMetrics';
import { SYSTEM_THRESHOLDS } from '../../constants/thresholds';

export class MetricsService {
    async getMetrics(systemId: string, timeRange: string) {
        return SystemMetrics.find({
            systemId,
            timestamp: { $gte: this.getTimeRangeDate(timeRange) }
        }).sort({ timestamp: 1 });
    }

    async addMetrics(systemId: string, metrics: any) {
        return SystemMetrics.create({
            systemId,
            ...metrics,
            timestamp: new Date()
        });
    }

    async checkThresholds(metrics: any) {
        const alerts = [];

        for (const [key, value] of Object.entries(metrics)) {
            const threshold = SYSTEM_THRESHOLDS[key];
            if (!threshold) continue;

            if (value < threshold.min || value > threshold.max) {
                alerts.push({
                    type: 'threshold',
                    metric: key,
                    value,
                    threshold
                });
            }
        }

        return alerts;
    }

    private getTimeRangeDate(timeRange: string) {
        const now = new Date();
        switch (timeRange) {
            case '24h':
                return new Date(now.setHours(now.getHours() - 24));
            case '7d':
                return new Date(now.setDate(now.getDate() - 7));
            case '30d':
                return new Date(now.setDate(now.getDate() - 30));
            default:
                return new Date(now.setHours(now.getHours() - 24));
        }
    }
}
