// src/components/dashboard/metrics/MetricValue.tsx
interface MetricValueProps {
    value: number;
    unit: string;
    label: string;
    icon: string;
    status?: 'normal' | 'warning' | 'error';
}

export function MetricValue({ value, unit, label, icon, status = 'normal' }: MetricValueProps) {
    const statusColors = {
        normal: 'text-green-600',
        warning: 'text-yellow-600',
        error: 'text-red-600'
    };

    return (
        <div className="flex items-center space-x-3">
            <span className={`text-2xl ${statusColors[status]}`}>{icon}</span>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="font-medium">
                    {value}
                    {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
                </p>
            </div>
        </div>
    );
}
