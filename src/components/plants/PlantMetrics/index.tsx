// src/components/plants/PlantMetrics/index.tsx
import { MetricCard } from './MetricCard';
import { GrowthChart } from './GrowthChart';
import type { Plant, PlantMetrics } from '../../../types/plant';

interface PlantMetricsProps {
    plant: Plant;
    metrics: PlantMetrics[];
}

export function PlantMetrics({ plant, metrics }: PlantMetricsProps) {
    const latestMetrics = metrics[metrics.length - 1];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard
                    label="Высота"
                    value={latestMetrics?.height || 0}
                    unit="см"
                    trend={calculateTrend(metrics, 'height')}
                />
                <MetricCard
                    label="Листья"
                    value={latestMetrics?.leafCount || 0}
                    unit="шт"
                    trend={calculateTrend(metrics, 'leafCount')}
                />
                <MetricCard
                    label="Здоровье"
                    value={latestMetrics?.healthScore || 0}
                    unit="%"
                    trend={calculateTrend(metrics, 'healthScore')}
                />
            </div>

            <GrowthChart metrics={metrics} />
        </div>
    );
}
