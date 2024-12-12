import { useState, useCallback } from 'react';
import { SystemSettings, SettingsKey } from '../types/settings';
import { getSettings, updateSettings } from '../utils/storage';

export function useSettings() {
  const [settings, setSettings] = useState<SystemSettings>(getSettings);

  const updateSetting = useCallback(<K extends SettingsKey>(
    key: K,
    value: SystemSettings[K]
  ) => {
    const newSettings = updateSettings(key, value);
    setSettings(newSettings);
  }, []);

  return {
    settings,
    updateSetting
  };
}