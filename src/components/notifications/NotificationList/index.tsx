// src/components/notifications/NotificationList/index.tsx
import { NotificationItem } from './NotificationItem';
import { EmptyState } from './EmptyState';
import type { Notification } from '../../../types/notification';

interface NotificationListProps {
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    onDelete: (id: string) => void;
}

export function NotificationList({
                                     notifications,
                                     onMarkAsRead,
                                     onDelete
                                 }: NotificationListProps) {
    if (notifications.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="space-y-2">
            {notifications.map(notification => (
                <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={onMarkAsRead}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
