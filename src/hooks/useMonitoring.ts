// src/hooks/useMonitoring.ts
import { useState, useEffect } from 'react';
import { MonitoringService } from '../api/services/monitoring.service';
import type {
    SystemMetrics,
    Alert,
    MaintenanceTask
} from '../types/monitoring';

export function useMonitoring(systemId: string) {
    const [metrics, setMetrics] = useState<SystemMetrics[]>([]);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [metricsData, alertsData, tasksData] = await Promise.all([
                MonitoringService.getMetrics(systemId, '24h'),
                MonitoringService.getAlerts(systemId),
                MonitoringService.getMaintenanceTasks(systemId)
            ]);

            setMetrics(metricsData.data);
            setAlerts(alertsData.data);
            setTasks(tasksData.data);
        } catch (err) {
            setError('Failed to load monitoring data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Обновляем данные каждую минуту
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, [systemId]);

    const resolveAlert = async (alertId: string) => {
        try {
            await MonitoringService.resolveAlert(alertId);
            setAlerts(prev => prev.filter(a => a.id !== alertId));
        } catch (err) {
            throw new Error('Failed to resolve alert');
        }
    };

    const completeTask = async (taskId: string) => {
        try {
            const { data } = await MonitoringService.completeTask(taskId);
            setTasks(prev =>
                prev.map(t => (t.id === taskId ? data : t))
            );
        } catch (err) {
            throw new Error('Failed to complete task');
        }
    };

    return {
        metrics,
        alerts,
        tasks,
        loading,
        error,
        resolveAlert,
        completeTask,
        refresh: fetchData
    };
}
