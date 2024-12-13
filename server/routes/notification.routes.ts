// server/routes/notification.routes.ts
import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { auth } from '../middleware/auth.middleware';

const router = Router();

router.use(auth);

router.get('/', NotificationController.getUserNotifications);
router.put('/:notificationId/read', NotificationController.markAsRead);
router.put('/read-all', NotificationController.markAllAsRead);
router.delete('/:notificationId', NotificationController.deleteNotification);

export const notificationRoutes = router;
