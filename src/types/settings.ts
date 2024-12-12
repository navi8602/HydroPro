export interface NotificationSettings {
  alertsEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  dailyReports: boolean;
  weeklyReports: boolean;
}

export interface PowerSettings {
  mode: 'eco' | 'night' | 'day';
  autoAdjust: boolean;
  smartScheduling: boolean;
  peakAvoidance: boolean;
}

export interface MaintenanceSettings {
  autoSchedule: boolean;
  notifications: boolean;
  preventiveMaintenance: boolean;
}

export interface SystemSettings {
  notifications: NotificationSettings;
  power: PowerSettings;
  maintenance: MaintenanceSettings;
  version: number;
}

export type SettingsKey = keyof Omit<SystemSettings, 'version'>;