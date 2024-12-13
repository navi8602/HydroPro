// server/routes/system.routes.ts
import { Router } from 'express';
import { systemController } from '../controllers/system.controller';
import { auth } from '../middleware/auth';
import { validateSystemRental } from '../validators/system';

const router = Router();

router.use(auth);

router.get('/', systemController.getRentedSystems);
router.post('/rent', validateSystemRental, systemController.rentSystem);
router.get('/:systemId/metrics', systemController.getSystemMetrics);

export const systemRoutes = router;
