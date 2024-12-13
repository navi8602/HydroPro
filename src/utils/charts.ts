// src/utils/charts.ts
import { EnvironmentData } from '../types/monitoring';

export function formatChartData(data: EnvironmentData[], metric: keyof EnvironmentData) {
    return {
        labels: data.map(d => new Date(d.timestamp).toLocaleTimeString()),
        datasets: [{
            label: getMetricLabel(metric),
            data: data.map(d => d[metric]),
            borderColor: getMetricColor(metric),
            tension: 0.1
        }]
    };
}

export function getMetricLabel(metric: string): string {
    const labels: Record<string, string> = {
        temperature: 'Температура',
        humidity: 'Влажность',
        lightLevel: 'Освещенность',
        phLevel: 'pH',
        nutrientLevel: 'Питательные вещества'
    };
    return labels[metric] || metric;
}

export function getMetricColor(metric: string): string {
    const colors: Record<string, string> = {
        temperature: 'rgb(239, 68, 68)',
        humidity: 'rgb(59, 130, 246)',
        lightLevel: 'rgb(245, 158, 11)',
        phLevel: 'rgb(16, 185, 129)',
        nutrientLevel: 'rgb(139, 92, 246)'
    };
    return colors[metric] || 'rgb(107, 114, 128)';
}
