// src/components/plants/PlantMetrics/MetricCard.tsx
interface MetricCardProps {
    label: string;
    value: number;
    unit: string;
    trend: number;
}

export function MetricCard({ label, value, unit, trend }: MetricCardProps) {
    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-500">{label}</p>
                    <p className="text-2xl font-semibold">
                        {value} {unit}
                    </p>
                </div>
                <div className={`
          flex items-center px-2 py-1 rounded-full text-sm
          ${trend > 0 ? 'bg-green-100 text-green-800' :
                    trend < 0 ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'}
        `}>
                    {trend > 0 ? '+' : ''}{trend}%
                </div>
            </div>
        </div>
    );
}
