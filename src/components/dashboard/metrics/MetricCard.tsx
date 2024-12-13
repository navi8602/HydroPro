// src/components/dashboard/metrics/MetricCard.tsx
interface MetricCardProps {
    title: string;
    value: string | number;
    icon: string;
    trend?: {
        value: number;
        label: string;
    };
    className?: string;
}

export function MetricCard({ title, value, icon, trend, className = '' }: MetricCardProps) {
    return (
        <div className={`bg-white p-4 rounded-lg border border-gray-200 ${className}`}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{icon}</span>
                <span className="text-sm text-gray-500">{title}</span>
            </div>
            <div className="text-2xl font-semibold mb-1">{value}</div>
            {trend && (
                <div className={`text-sm flex items-center ${
                    trend.value >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                    {trend.value >= 0 ? '↑' : '↓'}
                    <span className="ml-1">{Math.abs(trend.value)}%</span>
                    <span className="ml-2 text-gray-500">{trend.label}</span>
                </div>
            )}
        </div>
    );
}
