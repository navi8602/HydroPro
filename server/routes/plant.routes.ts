// server/routes/plant.routes.ts
import { Router } from 'express';
import { plantController } from '../controllers/plant.controller';
import { auth } from '../middleware/auth';
import { validatePlantAddition } from '../validators/plant';

const router = Router();

router.use(auth);

router.post('/:systemId/plants', validatePlantAddition, plantController.addPlant);
router.get('/plants/:plantId/growth', plantController.getPlantGrowthData);

export const plantRoutes = router;
