// src/components/dashboard/stats/StatProgress.tsx
interface StatProgressProps {
    value: number;
    total: number;
    color: string;
}

export function StatProgress({ value, total, color }: StatProgressProps) {
    const percentage = (value / total) * 100;

    return (
        <div className="mt-2">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Прогресс</span>
                <span>{Math.round(percentage)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all ${color}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
