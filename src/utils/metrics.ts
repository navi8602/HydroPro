import { SystemMetrics } from '../types/system';
import { SYSTEM_THRESHOLDS } from './constants';

export const getMetricStatusColor = (
  value: number,
  threshold: { min: number; max: number }
): string => {
  if (value < threshold.min || value > threshold.max) return 'text-red-500';
  if (value < threshold.min + 2 || value > threshold.max - 2) return 'text-yellow-500';
  return 'text-green-500';
};

export const formatMetricValue = (
  value: number,
  metric: keyof typeof SYSTEM_THRESHOLDS
): string => {
  return `${value}${SYSTEM_THRESHOLDS[metric].unit}`;
};