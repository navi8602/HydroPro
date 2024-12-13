// server/routes/notification.routes.js
import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller.js';
import { auth } from '../middleware/auth.js';
import { validateNotificationPreferences } from '../validators/notification.js';

const router = Router();

router.use(auth);

router.get('/', notificationController.getNotifications);
router.put('/:notificationId/read', notificationController.markAsRead);
router.put('/preferences', validateNotificationPreferences, notificationController.updateNotificationPreferences);

export const notificationRoutes = router;
