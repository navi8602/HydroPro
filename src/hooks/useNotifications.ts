
import { useState, useEffect } from 'react';
import { checkPlantConditions } from '../utils/notifications';
import { Plant, SystemMetrics } from '../types/system';

export function useNotifications(plants: Plant[], metrics: SystemMetrics) {
  const [notifications, setNotifications] = useState<Array<{
    type: 'warning' | 'error' | 'info';
    message: string;
  }>>([]);

  useEffect(() => {
    const allAlerts = plants.flatMap(plant => checkPlantConditions(plant, metrics));
    setNotifications(allAlerts);
  }, [plants, metrics]);

  return notifications;
}
