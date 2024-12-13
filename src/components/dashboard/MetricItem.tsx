// src/components/dashboard/MetricItem.tsx
import { useEffect, useState } from 'react';
import { SystemService } from '../../api/services/system.service';
import type { SystemMetric } from '../../types/dashboard';

interface MetricItemProps {
  systemId: string;
  metricKey: string;
  label: string;
  icon: string;
  unit: string;
  thresholds: {
    min: number;
    max: number;
    warning: number;
    critical: number;
  };
}

export function MetricItem({
                             systemId,
                             metricKey,
                             label,
                             icon,
                             unit,
                             thresholds
                           }: MetricItemProps) {
  const [metric, setMetric] = useState<SystemMetric | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetric = async () => {
      try {
        const response = await SystemService.getMetric(systemId, metricKey);
        setMetric(response.data);
      } catch (error) {
        console.error(`Failed to fetch ${metricKey} metric:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetric();

    // Обновляем метрику каждые 30 секунд
    const interval = setInterval(fetchMetric, 30000);
    return () => clearInterval(interval);
  }, [systemId, metricKey]);

  if (loading) return <MetricLoader />;
  if (!metric) return null;

  const getStatusColor = (value: number) => {
    if (value <= thresholds.min || value >= thresholds.max) {
      return 'text-red-600';
    }
    if (value <= thresholds.warning || value >= thresholds.critical) {
      return 'text-yellow-600';
    }
    return 'text-green-600';
  };

  const statusColor = getStatusColor(metric.value);

  return (
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{icon}</span>
            <span className="font-medium text-gray-900">{label}</span>
          </div>
          <span className={`text-lg font-semibold ${statusColor}`}>
          {metric.value}{unit}
        </span>
        </div>

        <div className="space-y-2">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
                className={`h-full transition-all ${statusColor.replace('text', 'bg')}`}
                style={{
                  width: `${(metric.value / thresholds.max) * 100}%`
                }}
            />
          </div>

          <div className="flex justify-between text-xs text-gray-500">
            <span>Мин: {thresholds.min}{unit}</span>
            <span>Макс: {thresholds.max}{unit}</span>
          </div>

          {metric.lastUpdated && (
              <p className="text-xs text-gray-400 text-right">
                Обновлено: {new Date(metric.lastUpdated).toLocaleTimeString()}
              </p>
          )}
        </div>
      </div>
  );
}

function MetricLoader() {
  return (
      <div className="bg-white p-4 rounded-lg border border-gray-200 animate-pulse">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
          <div className="h-6 w-16 bg-gray-200 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-2 w-full bg-gray-200 rounded-full" />
          <div className="flex justify-between">
            <div className="h-3 w-12 bg-gray-200 rounded" />
            <div className="h-3 w-12 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
  );
}
