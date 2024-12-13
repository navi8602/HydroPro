// server/services/monitoring/monitoring-scheduler.service.ts
import { SystemMonitoringService } from './system-monitoring.service';
import { PlantMonitoringService } from './plant-monitoring.service';
import { MONITORING_INTERVALS } from '../../constants/monitoring';

export class MonitoringSchedulerService {
    private static systemMetricsInterval: NodeJS.Timer;
    private static plantMetricsInterval: NodeJS.Timer;

    static startMonitoring() {
        this.systemMetricsInterval = setInterval(
            this.collectSystemMetrics,
            MONITORING_INTERVALS.systemMetrics
        );

        this.plantMetricsInterval = setInterval(
            this.collectPlantMetrics,
            MONITORING_INTERVALS.plantMetrics
        );
    }

    static stopMonitoring() {
        clearInterval(this.systemMetricsInterval);
        clearInterval(this.plantMetricsInterval);
    }

    private static async collectSystemMetrics() {
        // Implement system metrics collection logic
    }

    private static async collectPlantMetrics() {
        // Implement plant metrics collection logic
    }
}
