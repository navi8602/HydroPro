// src/components/monitoring/SystemMonitoring/MonitoringDashboard.tsx
import { MetricsChart } from './MetricsChart';
import { MetricsGrid } from './MetricsGrid';
import type { SystemMetrics } from '../../../types/system';

interface MonitoringDashboardProps {
    metrics: SystemMetrics[];
}

export function MonitoringDashboard({ metrics }: MonitoringDashboardProps) {
    return (
        <div className="space-y-6">
            <MetricsChart data={metrics} />
            <MetricsGrid currentMetrics={metrics[metrics.length - 1]} />
        </div>
    );
}
