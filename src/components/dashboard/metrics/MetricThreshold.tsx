// src/components/dashboard/metrics/MetricThreshold.tsx
interface MetricThresholdProps {
    current: number;
    min: number;
    max: number;
    unit: string;
}

export function MetricThreshold({ current, min, max, unit }: MetricThresholdProps) {
    const percentage = ((current - min) / (max - min)) * 100;

    return (
        <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-500">
                <span>{min}{unit}</span>
                <span>{max}{unit}</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full mt-1">
                <div
                    className={`h-full rounded-full transition-all ${
                        percentage < 25 || percentage > 75 ? 'bg-red-500' :
                            percentage < 40 || percentage > 60 ? 'bg-yellow-500' :
                                'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
                />
            </div>
        </div>
    );
}
