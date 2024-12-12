import { Alert } from '../../types/monitoring';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface AlertsListProps {
  alerts: Alert[];
  onResolveAlert: (alertId: string) => void;
}

export function AlertsList({ alerts, onResolveAlert }: AlertsListProps) {
  const sortedAlerts = [...alerts].sort((a, b) => {
    // Сначала нерешенные
    if (a.resolved !== b.resolved) {
      return a.resolved ? 1 : -1;
    }
    // Затем по времени
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Уведомления и предупреждения</h3>
        <span className="text-sm text-gray-500">
          {alerts.filter(a => !a.resolved).length} активных
        </span>
      </div>

      <div className="space-y-2">
        {sortedAlerts.map(alert => (
          <div
            key={alert.id}
            className={`
              flex items-start justify-between p-3 rounded-lg
              ${alert.resolved 
                ? 'bg-gray-50' 
                : alert.type === 'critical' 
                  ? 'bg-red-50' 
                  : 'bg-yellow-50'}
            `}
          >
            <div className="flex items-start space-x-3">
              <AlertTriangle className={`
                h-5 w-5 mt-0.5
                ${alert.resolved 
                  ? 'text-gray-400' 
                  : alert.type === 'critical' 
                    ? 'text-red-600' 
                    : 'text-yellow-600'}
              `} />
              <div>
                <p className={`
                  font-medium
                  ${alert.resolved 
                    ? 'text-gray-700' 
                    : alert.type === 'critical' 
                      ? 'text-red-800' 
                      : 'text-yellow-800'}
                `}>
                  {alert.message}
                </p>
                <div className="mt-1 flex items-center space-x-2 text-sm">
                  <span className="text-gray-500">
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>
                  {alert.resolved && (
                    <span className="flex items-center text-green-600">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Решено {new Date(alert.resolvedAt!).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {!alert.resolved && (
              <button
                onClick={() => onResolveAlert(alert.id)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}