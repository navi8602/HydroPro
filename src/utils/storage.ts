import { SystemSettings, SettingsKey } from '../types/settings';

const STORAGE_KEY = 'hydropro_settings';
const CURRENT_VERSION = 1;

const DEFAULT_SETTINGS: SystemSettings = {
  notifications: {
    alertsEnabled: true,
    emailNotifications: true,
    pushNotifications: false,
    dailyReports: true,
    weeklyReports: true
  },
  power: {
    mode: 'day',
    autoAdjust: true,
    smartScheduling: true,
    peakAvoidance: false
  },
  maintenance: {
    autoSchedule: true,
    notifications: true,
    preventiveMaintenance: false
  },
  version: CURRENT_VERSION
};

export function getSettings(): SystemSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_SETTINGS;
    }

    const settings = JSON.parse(stored) as SystemSettings;
    
    // Проверка версии и обновление при необходимости
    if (!settings.version || settings.version < CURRENT_VERSION) {
      const updatedSettings = migrateSettings(settings);
      saveSettings(updatedSettings);
      return updatedSettings;
    }

    return settings;
  } catch (error) {
    console.error('Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: SystemSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

export function updateSettings<K extends SettingsKey>(
  key: K,
  value: SystemSettings[K]
): SystemSettings {
  const currentSettings = getSettings();
  const newSettings = {
    ...currentSettings,
    [key]: value
  };
  saveSettings(newSettings);
  return newSettings;
}

function migrateSettings(oldSettings: Partial<SystemSettings>): SystemSettings {
  // Здесь можно добавить логику миграции при изменении структуры настроек
  return {
    ...DEFAULT_SETTINGS,
    ...oldSettings,
    version: CURRENT_VERSION
  };
}