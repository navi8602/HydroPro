import { formatDistance } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { SystemAlert } from '../../../types/monitoring';

interface AlertItemProps {
    alert: SystemAlert;
    onResolve: (id: string) => void;
}

export function AlertItem({ alert, onResolve }: AlertItemProps) {
    const timeAgo = formatDistance(
        new Date(alert.timestamp),
        new Date(),
        { addSuffix: true, locale: ru }
    );

    return (
        <div className={`
      p-4 rounded-lg border
      ${alert.severity === 'critical' ? 'bg-red-50 border-red-200' :
            alert.severity === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                'bg-blue-50 border-blue-200'}
    `}>
            <div className="flex justify-between items-start">
                <div>
                    <h4 className={`
            font-medium
            ${alert.severity === 'critical' ? 'text-red-800' :
                        alert.severity === 'warning' ? 'text-yellow-800' :
                            'text-blue-800'}
          `}>
                        {alert.title}
                    </h4>
                    <p className="text-sm mt-1">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{timeAgo}</p>
                </div>

                {!alert.resolved && (
                    <button
                        onClick={() => onResolve(alert.id)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        Решено
                    </button>
                )}
            </div>
        </div>
    );
}
