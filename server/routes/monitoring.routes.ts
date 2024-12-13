// server/routes/monitoring.routes.ts
import { Router } from 'express';
import { MonitoringController } from '../controllers/monitoring.controller';
import { auth } from '../middleware/auth.middleware';
import {
    systemMetricsValidator,
    plantMetricsValidator,
    dateRangeValidator
} from '../validators/monitoring.validator';

const router = Router();

router.use(auth);

router.post(
    '/systems/:systemId/metrics',
    systemMetricsValidator,
    MonitoringController.recordSystemMetrics
);

router.get(
    '/systems/:systemId/metrics',
    dateRangeValidator,
    MonitoringController.getSystemMetrics
);

router.post(
    '/plants/:plantId/metrics',
    plantMetricsValidator,
    MonitoringController.recordPlantMetrics
);

router.get(
    '/plants/:plantId/growth',
    MonitoringController.getPlantGrowthHistory
);

export const monitoringRoutes = router;
