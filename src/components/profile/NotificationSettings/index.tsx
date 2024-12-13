// src/components/profile/NotificationSettings/index.tsx
import { NotificationChannels } from './NotificationChannels';
import { NotificationTypes } from './NotificationTypes';
import { NotificationSchedule } from './NotificationSchedule';
import type { UserSettings } from '../../../types/user';

interface NotificationSettingsProps {
    settings: UserSettings['notifications'];
    onUpdate: (data: Partial<UserSettings['notifications']>) => Promise<void>;
}

export function NotificationSettings({
                                         settings,
                                         onUpdate
                                     }: NotificationSettingsProps) {
    return (
        <div className="space-y-6">
            <NotificationChannels
                channels={settings.channels}
                onUpdate={(channels) => onUpdate({ channels })}
            />

            <NotificationTypes
                types={settings.types}
                onUpdate={(types) => onUpdate({ types })}
            />

            <NotificationSchedule
                schedule={settings.schedule}
                onUpdate={(schedule) => onUpdate({ schedule })}
            />
        </div>
    );
}
