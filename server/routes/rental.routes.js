// server/routes/rental.routes.js
import { Router } from 'express';
import { rentalController } from '../controllers/rental.controller.js';
import { auth } from '../middleware/auth.js';
import { validateRental } from '../validators/rental.js';

const router = Router();

router.use(auth);

router.get('/', rentalController.getRentedSystems);
router.post('/rent', validateRental, rentalController.rentSystem);
router.post('/:rentalId/cancel', rentalController.cancelRental);

export const rentalRoutes = router;
