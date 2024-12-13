// src/components/monitoring/SystemMonitoring/index.tsx
import { useState } from 'react';
import { useSystemMonitoring } from '../../../hooks/useSystemMonitoring';
import { MonitoringDashboard } from './MonitoringDashboard';
import { MonitoringControls } from './MonitoringControls';
import { MonitoringAlerts } from './MonitoringAlerts';
import type { TimeRange } from '../../../types/monitoring';

interface SystemMonitoringProps {
    systemId: string;
}

export function SystemMonitoring({ systemId }: SystemMonitoringProps) {
    const [timeRange, setTimeRange] = useState<TimeRange>('24h');
    const {
        metrics,
        alerts,
        loading,
        error,
        updateMetrics,
        resolveAlert
    } = useSystemMonitoring(systemId, timeRange);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="space-y-6">
            <MonitoringControls
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
                onUpdateMetrics={updateMetrics}
            />
            <MonitoringDashboard metrics={metrics} />
            <MonitoringAlerts
                alerts={alerts}
                onResolve={resolveAlert}
            />
        </div>
    );
}
