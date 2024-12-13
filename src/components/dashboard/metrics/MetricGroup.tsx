// src/components/dashboard/metrics/MetricGroup.tsx
import { MetricCard } from './MetricCard';

interface Metric {
    id: string;
    title: string;
    value: string | number;
    icon: string;
    trend?: {
        value: number;
        label: string;
    };
}

interface MetricGroupProps {
    metrics: Metric[];
    columns?: 2 | 3 | 4;
}

export function MetricGroup({ metrics, columns = 4 }: MetricGroupProps) {
    const gridCols = {
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    };

    return (
        <div className={`grid ${gridCols[columns]} gap-4`}>
            {metrics.map(metric => (
                <MetricCard
                    key={metric.id}
                    title={metric.title}
                    value={metric.value}
                    icon={metric.icon}
                    trend={metric.trend}
                />
            ))}
        </div>
    );
}
