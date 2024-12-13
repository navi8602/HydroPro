// src/utils/alerts.ts
import type { Alert } from '../types/monitoring';

export function categorizeAlerts(alerts: Alert[]): {
    critical: Alert[];
    warning: Alert[];
    info: Alert[];
} {
    return {
        critical: alerts.filter(a => a.severity === 'critical'),
        warning: alerts.filter(a => a.severity === 'warning'),
        info: alerts.filter(a => a.severity === 'info')
    };
}
