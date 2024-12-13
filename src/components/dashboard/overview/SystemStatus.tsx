// src/components/dashboard/overview/SystemStatus.tsx
interface SystemStatusProps {
    status: 'active' | 'warning' | 'error' | 'maintenance';
    lastUpdate: string;
}

export function SystemStatus({ status, lastUpdate }: SystemStatusProps) {
    const statusConfig = {
        active: { label: 'Активна', color: 'text-green-600', bg: 'bg-green-100' },
        warning: { label: 'Внимание', color: 'text-yellow-600', bg: 'bg-yellow-100' },
        error: { label: 'Ошибка', color: 'text-red-600', bg: 'bg-red-100' },
        maintenance: { label: 'Обслуживание', color: 'text-blue-600', bg: 'bg-blue-100' }
    };

    const config = statusConfig[status];

    return (
        <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-2 ${config.color}`}>
                <span className={`w-2 h-2 rounded-full ${config.bg}`} />
                <span className="font-medium">{config.label}</span>
            </div>
            <span className="text-sm text-gray-500">
        Обновлено: {new Date(lastUpdate).toLocaleString()}
      </span>
        </div>
    );
}
