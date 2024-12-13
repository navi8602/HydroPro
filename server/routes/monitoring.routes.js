// server/routes/monitoring.routes.js
import { Router } from 'express';
import { monitoringController } from '../controllers/monitoring.controller.js';
import { auth } from '../middleware/auth.js';
import { validateGrowthData } from '../validators/monitoring.js';

const router = Router();

router.use(auth);

router.get('/systems/:systemId/metrics', monitoringController.getSystemMetrics);
router.post('/plants/:plantId/growth', validateGrowthData, monitoringController.addGrowthData);
router.get('/plants/:plantId/growth-history', monitoringController.getPlantGrowthHistory);

export const monitoringRoutes = router;
