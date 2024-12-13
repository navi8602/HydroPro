// server/services/monitoring/alerts.service.ts
import { Alert } from '../../models/Alert';
import { NotificationService } from '../notification/notification.service';

export class AlertsService {
    constructor(private notificationService: NotificationService) {}

    async createAlert(data: {
        systemId: string;
        type: string;
        message: string;
        severity: 'warning' | 'critical';
    }) {
        const alert = await Alert.create({
            ...data,
            timestamp: new Date(),
            resolved: false
        });

        await this.notificationService.sendAlert(alert);
        return alert;
    }

    async resolveAlert(alertId: string, userId: string) {
        return Alert.findOneAndUpdate(
            { _id: alertId },
            {
                resolved: true,
                resolvedAt: new Date(),
                resolvedBy: userId
            },
            { new: true }
        );
    }

    async getActiveAlerts(systemId: string) {
        return Alert.find({
            systemId,
            resolved: false
        }).sort({ timestamp: -1 });
    }
}
