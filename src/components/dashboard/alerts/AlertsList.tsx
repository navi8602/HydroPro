// src/components/dashboard/alerts/AlertsList.tsx
import { AlertBadge } from './AlertBadge';
import type { SystemAlert } from '../../../types/alerts';

interface AlertsListProps {
    alerts: SystemAlert[];
    onDismiss?: (alertId: string) => void;
    onResolve?: (alertId: string) => void;
}

export function AlertsList({ alerts, onDismiss, onResolve }: AlertsListProps) {
    if (alerts.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
                <span className="text-2xl mb-3">🎉</span>
                <h3 className="text-lg font-medium text-gray-900">Нет активных уведомлений</h3>
                <p className="text-gray-500">Все системы работают нормально</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {alerts.map(alert => (
                <div
                    key={alert.id}
                    className="flex items-start justify-between p-4 bg-white rounded-lg border border-gray-200"
                >
                    <div className="flex items-start space-x-3">
                        <span className="text-2xl">{getAlertIcon(alert.severity)}</span>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h4 className="font-medium">{alert.title}</h4>
                                <AlertBadge severity={alert.severity}>
                                    {getAlertSeverityLabel(alert.severity)}
                                </AlertBadge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <span>{formatAlertTime(alert.timestamp)}</span>
                                {alert.source && (
                                    <span>Источник: {alert.source}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        {onResolve && !alert.resolved && (
                            <button
                                onClick={() => onResolve(alert.id)}
                                className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg"
                            >
                                Решено
                            </button>
                        )}
                        {onDismiss && (
                            <button
                                onClick={() => onDismiss(alert.id)}
                                className="p-1 text-gray-400 hover:text-gray-500"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

function getAlertIcon(severity: SystemAlert['severity']): string {
    const icons = {
        info: 'ℹ️',
        warning: '⚠️',
        error: '🚨',
        success: '✅'
    };
    return icons[severity];
}

function getAlertSeverityLabel(severity: SystemAlert['severity']): string {
    const labels = {
        info: 'Информация',
        warning: 'Внимание',
        error: 'Критично',
        success: 'Успешно'
    };
    return labels[severity];
}

function formatAlertTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'Только что';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} мин. назад`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} ч. назад`;

    return date.toLocaleDateString();
}
