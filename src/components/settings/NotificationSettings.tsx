import { useState } from 'react';
import { Switch } from '../ui/Switch';

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    alertsEnabled: true,
    emailNotifications: true,
    pushNotifications: false,
    dailyReports: true,
    weeklyReports: true
  });

  const handleChange = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Настройки уведомлений</h3>
        <div className="space-y-4">
          {Object.entries(settings).map(([key, value]) => (
            <Switch
              key={key}
              label={getNotificationLabel(key)}
              description={getNotificationDescription(key)}
              checked={value}
              onChange={() => handleChange(key as keyof typeof settings)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function getNotificationLabel(key: string): string {
  const labels: Record<string, string> = {
    alertsEnabled: 'Системные оповещения',
    emailNotifications: 'Email уведомления',
    pushNotifications: 'Push-уведомления',
    dailyReports: 'Ежедневные отчеты',
    weeklyReports: 'Еженедельные отчеты'
  };
  return labels[key] || key;
}

function getNotificationDescription(key: string): string {
  const descriptions: Record<string, string> = {
    alertsEnabled: 'Получать уведомления о критических изменениях в системе',
    emailNotifications: 'Получать уведомления на email',
    pushNotifications: 'Получать push-уведомления в браузере',
    dailyReports: 'Получать ежедневные отчеты о состоянии системы',
    weeklyReports: 'Получать еженедельные сводки и аналитику'
  };
  return descriptions[key] || '';
}