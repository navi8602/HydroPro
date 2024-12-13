// src/components/dashboard/metrics/MetricChart.tsx
import { Line } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';

interface MetricChartProps {
    data: ChartData<'line'>;
    options?: ChartOptions<'line'>;
    height?: number;
}

export function MetricChart({ data, options, height = 300 }: MetricChartProps) {
    const defaultOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom'
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    return (
        <div style={{ height }}>
            <Line data={data} options={{ ...defaultOptions, ...options }} />
        </div>
    );
}
