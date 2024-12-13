// server/controllers/monitoring.controller.ts
import { Request, Response, NextFunction } from 'express';
import { SystemMonitoringService } from '../services/monitoring/system-monitoring.service';
import { PlantMonitoringService } from '../services/monitoring/plant-monitoring.service';
import { ApiError } from '../utils/ApiError';

export class MonitoringController {
    static async recordSystemMetrics(req: Request, res: Response, next: NextFunction) {
        try {
            const { systemId } = req.params;
            const metrics = req.body;

            const result = await SystemMonitoringService.recordMetrics(systemId, metrics);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    static async getSystemMetrics(req: Request, res: Response, next: NextFunction) {
        try {
            const { systemId } = req.params;
            const { start, end } = req.query;

            const metrics = await SystemMonitoringService.getSystemMetricsHistory(
                systemId,
                {
                    start: new Date(start as string),
                    end: new Date(end as string)
                }
            );

            res.json(metrics);
        } catch (error) {
            next(error);
        }
    }

    // Similar methods for plant monitoring...
}
