interface StatCardProps {
    title: string;
    value: number;
    total?: number;
    color: string;
    bgColor: string;
    icon?: React.ReactNode;
    trend?: {
        value: number;
        direction: 'up' | 'down';
    };
}

export function StatCard({
                             title,
                             value,
                             total,
                             color,
                             bgColor,
                             icon,
                             trend
                         }: StatCardProps) {
    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
                {icon && (
                    <div className={`p-2 rounded-lg ${bgColor}`}>
                        {icon}
                    </div>
                )}
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <div className="flex items-baseline space-x-2">
                        <p className={`text-2xl font-semibold ${color}`}>{value}</p>
                        {total && (
                            <p className="text-sm text-gray-500">из {total}</p>
                        )}
                    </div>
                    {trend && (
                        <div className={`flex items-center text-sm ${
                            trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                            {trend.direction === 'up' ? '↑' : '↓'}
                            <span className="ml-1">{trend.value}%</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
