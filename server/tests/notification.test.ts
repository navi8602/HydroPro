// server/tests/notification.test.ts
import { createNotification } from '../services/notification.service';
import { User } from '../models/User';
import { mockUser, mockNotification } from './mocks';

jest.mock('../services/push.service');
jest.mock('../services/email.service');
jest.mock('../services/sms.service');

describe('Notification Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create notification and send to all enabled channels', async () => {
        const user = await User.create(mockUser);

        const notification = await createNotification({
            userId: user._id,
            title: 'Test',
            message: 'Test message',
            type: 'info'
        });

        expect(notification).toBeDefined();
        expect(notification.title).toBe('Test');
        expect(sendPushNotification).toHaveBeenCalled();
        expect(sendEmail).toHaveBeenCalled();
        expect(sendSms).not.toHaveBeenCalled(); // SMS only for error type
    });
});
