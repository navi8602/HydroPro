export const SYSTEM_THRESHOLDS = {
  temperature: { min: 18, max: 28, unit: '°C' },
  humidity: { min: 50, max: 80, unit: '%' },
  nutrientLevel: { min: 60, max: 100, unit: '%' },
  phLevel: { min: 5.5, max: 7.5, unit: '' }
} as const;

export const STORAGE_KEYS = {
  RENTED_SYSTEMS: 'hydropro_rented_systems',
  AUTH: 'hydropro_auth',
  SETTINGS: 'hydropro_settings'
} as const;