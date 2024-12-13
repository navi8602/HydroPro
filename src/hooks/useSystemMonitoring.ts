// src/hooks/useSystemMonitoring.ts
import { useState, useEffect } from 'react';
import { MonitoringService } from '../api/services/monitoring.service';
import type { SystemMetrics, Alert } from '../types/monitoring';

export function useSystemMonitoring(systemId: string, timeRange: TimeRange) {
    const [metrics, setMetrics] = useState<SystemMetrics[]>([]);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [metricsResponse, alertsResponse] = await Promise.all([
                    MonitoringService.getMetrics(systemId, timeRange),
                    MonitoringService.getAlerts(systemId)
                ]);
                setMetrics(metricsResponse.data);
                setAlerts(alertsResponse.data);
            } catch (err) {
                setError('Failed to load monitoring data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Настраиваем WebSocket для real-time обновлений
        const ws = MonitoringService.subscribeToUpdates(systemId, {
            onMetricsUpdate: (newMetrics) => {
                setMetrics(prev => [...prev, newMetrics]);
            },
            onAlert: (newAlert) => {
                setAlerts(prev => [...prev, newAlert]);
            }
        });

        return () => {
            ws.close();
        };
    }, [systemId, timeRange]);

    const updateMetrics = async (newMetrics: Partial<SystemMetrics>) => {
        try {
            const { data } = await MonitoringService.updateMetrics(systemId, newMetrics);
            setMetrics(prev => [...prev, data]);
            return data;
        } catch (err) {
            throw new Error('Failed to update metrics');
        }
    };

    const resolveAlert = async (alertId: string) => {
        try {
            await MonitoringService.resolveAlert(alertId);
            setAlerts(prev => prev.map(alert =>
                alert.id === alertId ? { ...alert, resolved: true } : alert
            ));
        } catch (err) {
            throw new Error('Failed to resolve alert');
        }
    };

    return {
        metrics,
        alerts,
        loading,
        error,
        updateMetrics,
        resolveAlert
    };
}
