// src/utils/apiMiddleware.ts
import { ApiError } from '../types/api';
import { useNotifications } from '../contexts/NotificationContext';

export function handleApiError(error: unknown): never {
    const { addNotification } = useNotifications();

    if (error instanceof Error) {
        addNotification({
            title: 'Ошибка',
            message: error.message,
            type: 'error'
        });
    } else {
        addNotification({
            title: 'Ошибка',
            message: 'Произошла неизвестная ошибка',
            type: 'error'
        });
    }

    throw error;
}
