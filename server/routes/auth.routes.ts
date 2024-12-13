// server/routes/auth.routes.ts
import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validateRegistration, validateLogin } from '../validators/auth';

const router = Router();

router.post('/register', validateRegistration, authController.register);
router.post('/verify', authController.verifyPhone);
router.post('/login', validateLogin, authController.login);

export const authRoutes = router;
