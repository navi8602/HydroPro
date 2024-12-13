// src/hooks/useAlerts.ts
import { useState, useEffect } from 'react';
import { MonitoringService } from '../api/services/monitoring.service';
import type { Alert } from '../types/monitoring';

export function useAlerts(systemId: string) {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const { data } = await MonitoringService.getAlerts(systemId);
                setAlerts(data);
            } catch (error) {
                console.error('Failed to load alerts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
    }, [systemId]);

    const resolveAlert = async (alertId: string) => {
        try {
            await MonitoringService.resolveAlert(alertId);
            setAlerts(prev => prev.map(alert =>
                alert.id === alertId
                    ? { ...alert, resolved: true, resolvedAt: new Date().toISOString() }
                    : alert
            ));
        } catch (error) {
            console.error('Failed to resolve alert:', error);
        }
    };

    return { alerts, loading, resolveAlert };
}
