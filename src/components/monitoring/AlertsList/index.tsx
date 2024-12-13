// src/components/monitoring/AlertsList/index.tsx
import { AlertItem } from './AlertItem';
import { AlertsFilter } from './AlertsFilter';
import type { SystemAlert } from '../../../types/monitoring';

interface AlertsListProps {
    alerts: SystemAlert[];
    onResolve: (id: string) => void;
}

export function AlertsList({ alerts, onResolve }: AlertsListProps) {
    const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');

    const filteredAlerts = alerts.filter(alert => {
        if (filter === 'active') return !alert.resolved;
        if (filter === 'resolved') return alert.resolved;
        return true;
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-medium">Уведомления системы</h3>
                <AlertsFilter value={filter} onChange={setFilter} />
            </div>

            <div className="space-y-3">
                {filteredAlerts.map(alert => (
                    <AlertItem
                        key={alert.id}
                        alert={alert}
                        onResolve={onResolve}
                    />
                ))}
            </div>

            {filteredAlerts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    {filter === 'all' ? 'Нет уведомлений' :
                        filter === 'active' ? 'Нет активных уведомлений' :
                            'Нет решенных уведомлений'}
                </div>
            )}
        </div>
    );
}
