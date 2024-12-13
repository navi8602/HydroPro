// src/utils/metrics/calculations.ts
import type { SystemMetrics } from '../../types/monitoring';

export function calculateAverageMetrics(
    metrics: SystemMetrics[],
    period: number
): SystemMetrics {
    const recentMetrics = metrics.slice(-period);

    return {
        temperature: average(recentMetrics.map(m => m.temperature)),
        humidity: average(recentMetrics.map(m => m.humidity)),
        phLevel: average(recentMetrics.map(m => m.phLevel)),
        nutrientLevel: average(recentMetrics.map(m => m.nutrientLevel)),
        timestamp: new Date().toISOString()
    };
}

// src/utils/metrics/thresholds.ts
export const METRIC_THRESHOLDS = {
    temperature: { min: 18, max: 28, unit: '°C' },
    humidity: { min: 50, max: 80, unit: '%' },
    phLevel: { min: 5.5, max: 7.5, unit: '' },
    nutrientLevel: { min: 60, max: 100, unit: '%' }
} as const;

export function checkMetricThreshold(
    value: number,
    metric: keyof typeof METRIC_THRESHOLDS
): 'normal' | 'warning' | 'critical' {
    const { min, max } = METRIC_THRESHOLDS[metric];

    if (value < min - 2 || value > max + 2) return 'critical';
    if (value < min || value > max) return 'warning';
    return 'normal';
}
