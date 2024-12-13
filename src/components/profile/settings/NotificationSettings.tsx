import { Switch } from '../../ui/Switch';
import type { NotificationPreferences } from '../../../types/user';

interface NotificationSettingsProps {
    preferences: NotificationPreferences;
    onChange: (preferences: NotificationPreferences) => void;
}

export function NotificationSettings({
                                         preferences,
                                         onChange
                                     }: NotificationSettingsProps) {
    const handleChange = (key: keyof NotificationPreferences) => {
        onChange({
            ...preferences,
            [key]: !preferences[key]
        });
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Настройки уведомлений</h3>
            <div className="space-y-3">
                <Switch
                    label="Email уведомления"
                    description="Получать важные уведомления на email"
                    checked={preferences.email}
                    onChange={() => handleChange('email')}
                />
                <Switch
                    label="Push-уведомления"
                    description="Получать уведомления в браузере"
                    checked={preferences.push}
                    onChange={() => handleChange('push')}
                />
                <Switch
                    label="SMS-уведомления"
                    description="Получать срочные уведомления по SMS"
                    checked={preferences.sms}
                    onChange={() => handleChange('sms')}
                />
            </div>
        </div>
    );
}
