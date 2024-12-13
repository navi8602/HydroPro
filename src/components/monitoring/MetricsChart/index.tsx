// src/components/monitoring/MetricsChart/index.tsx
import { Line } from 'react-chartjs-2';
import { MetricsTimeRange } from './MetricsTimeRange';
import { MetricsLegend } from './MetricsLegend';
import type { SystemMetrics } from '../../../types/system';

interface MetricsChartProps {
    data: SystemMetrics[];
    timeRange: string;
    onTimeRangeChange: (range: string) => void;
}

export function MetricsChart({
                                 data,
                                 timeRange,
                                 onTimeRangeChange
                             }: MetricsChartProps) {
    const chartData = {
        labels: data.map(d => new Date(d.timestamp).toLocaleTimeString()),
        datasets: [
            {
                label: 'Температура',
                data: data.map(d => d.temperature),
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            },
            {
                label: 'Влажность',
                data: data.map(d => d.humidity),
                borderColor: 'rgb(54, 162, 235)',
                tension: 0.1
            }
        ]
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <MetricsLegend datasets={chartData.datasets} />
                <MetricsTimeRange
                    value={timeRange}
                    onChange={onTimeRangeChange}
                />
            </div>

            <div className="bg-white p-4 rounded-lg border">
                <Line data={chartData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }} />
            </div>
        </div>
    );
}
