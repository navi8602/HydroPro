// server/controllers/monitoring.controller.ts
import { Request, Response, NextFunction } from 'express';
import { SystemMonitoringService } from '../services/monitoring/system-monitoring.service';
import { PlantMonitoringService } from '../services/monitoring/plant-monitoring.service';
import { ApiError } from '../utils/ApiError';

export class MonitoringController {
    static async recordSystemMetrics(req: Request, res: Response, next: NextFunction) {
        try {
            const metrics = await SystemMonitoringService.recordMetrics(
                req.params.systemId,
                req.body
            );
            res.json(metrics);
        } catch (error) {
            next(error);
        }
    }

    static async getSystemMetrics(req: Request, res: Response, next: NextFunction) {
        try {
            const { start, end } = req.query;
            if (!start || !end) {
                throw new ApiError(400, 'Start and end dates are required');
            }

            const metrics = await SystemMonitoringService.getSystemMetricsHistory(
                req.params.systemId,
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

    static async recordPlantMetrics(req: Request, res: Response, next: NextFunction) {
        try {
            const metrics = await PlantMonitoringService.recordMetrics(
                req.params.plantId,
                req.body
            );
            res.json(metrics);
        } catch (error) {
            next(error);
        }
    }

    static async getPlantGrowthHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const history = await PlantMonitoringService.getPlantGrowthHistory(
                req.params.plantId
            );
            res.json(history);
        } catch (error) {
            next(error);
        }
    }
}
