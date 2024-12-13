import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { WsClient } from '../api/wsClient';
import { NotificationsService } from '../api/services/notifications.service';
import type { Notification } from '../types/notification';


const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  useEffect(() => {
    // Подключение к WebSocket
    const socket = WsClient.connect();

    socket.on('notification:new', (notification: Notification) => {
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    });

    socket.on('notification:read', (notificationId: string) => {
      dispatch({ type: 'MARK_AS_READ', payload: notificationId });
    });

    // Загрузка существующих уведомлений
    const fetchNotifications = async () => {
      try {
        const { data } = await NotificationsService.getNotifications();
        data.forEach(notification =>
            dispatch({ type: 'ADD_NOTIFICATION', payload: notification })
        );
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    // Очищаем слушатели при размонтировании
    return () => {
      socket.off('notification:new');
      socket.off('notification:read');
    };
  }, []);

  const addNotification = (
      notification: Omit<Notification, 'id' | 'timestamp' | 'read'>
  ) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const markAsRead = (id: string) => {
    dispatch({ type: 'MARK_AS_READ', payload: id });
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const clearAll = () => {
    dispatch({ type: 'CLEAR_ALL' });
  };

  return (
      <NotificationContext.Provider
          value={{
            notifications: state.notifications,
            addNotification,
            markAsRead,
            removeNotification,
            clearAll
          }}
      >
        {children}
      </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
