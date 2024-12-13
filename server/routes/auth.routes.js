// server/routes/auth.routes.js
import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { validatePhone, validateCode } from '../validators/auth.js';

const router = Router();

router.post('/request-verification', validatePhone, authController.requestVerification);
router.post('/verify', validateCode, authController.verifyCode);

export const authRoutes = router;
