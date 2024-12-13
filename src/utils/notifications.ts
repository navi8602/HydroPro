// src/utils/notifications.ts
import type { Alert } from '../types/monitoring';

export function getAlertPriority(alert: Alert): number {
  if (alert.type === 'critical') return 2;
  if (alert.type === 'warning') return 1;
  return 0;
}

export function sortAlertsByPriority(alerts: Alert[]): Alert[] {
  return [...alerts].sort((a, b) => {
    const priorityDiff = getAlertPriority(b) - getAlertPriority(a);
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
}
