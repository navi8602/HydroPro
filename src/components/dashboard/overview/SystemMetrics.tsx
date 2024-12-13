// src/components/dashboard/overview/SystemMetrics.tsx
interface SystemMetricsProps {
    metrics: {
        temperature: number;
        humidity: number;
        ph: number;
        tds: number;
    };
}

export function SystemMetrics({ metrics }: SystemMetricsProps) {
    const metricsList = [
        { label: 'Температура', value: `${metrics.temperature}°C`, icon: '🌡️' },
        { label: 'Влажность', value: `${metrics.humidity}%`, icon: '💧' },
        { label: 'pH', value: metrics.ph.toFixed(1), icon: '⚗️' },
        { label: 'TDS', value: `${metrics.tds} ppm`, icon: '🧪' }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metricsList.map(metric => (
                <div key={metric.label} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <span className="text-xl">{metric.icon}</span>
                        <div>
                            <p className="text-sm text-gray-500">{metric.label}</p>
                            <p className="font-medium">{metric.value}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
