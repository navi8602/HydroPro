// server/websocket/handlers/monitoring.handler.ts
import { WebSocket } from 'ws';
import { SystemMonitoringService } from '../../services/monitoring/system-monitoring.service';
import { PlantMonitoringService } from '../../services/monitoring/plant-monitoring.service';

export class MonitoringWebSocketHandler {
    static async handleMessage(ws: WebSocket, message: any) {
        switch (message.type) {
            case 'subscribe_system_metrics':
                await this.handleSystemMetricsSubscription(ws, message.data);
                break;
            case 'subscribe_plant_metrics':
                await this.handlePlantMetricsSubscription(ws, message.data);
                break;
        }
    }

    private static async handleSystemMetricsSubscription(ws: WebSocket, data: any) {
        const metrics = await SystemMonitoringService.getSystemMetricsHistory(
            data.systemId,
            data.dateRange
        );

        ws.send(JSON.stringify({
            type: 'system_metrics_update',
            data: metrics
        }));
    }

    private static async handlePlantMetricsSubscription(ws: WebSocket, data: any) {
        const metrics = await PlantMonitoringService.getGrowthHistory(
            data.plantId,
            data.dateRange
        );

        ws.send(JSON.stringify({
            type: 'plant_metrics_update',
            data: metrics
        }));
    }
}
