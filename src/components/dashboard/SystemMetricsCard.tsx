import { SystemMetrics } from '../../types/system';
import { MetricItem } from './MetricItem';
import { Thermometer, Droplets, TestTube, Activity } from 'lucide-react';
import { formatDateTime } from '../../utils/date';

interface SystemMetricsCardProps {
  metrics: SystemMetrics;
}

export function SystemMetricsCard({ metrics }: SystemMetricsCardProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Показатели системы</h3>
      <div className="space-y-4">
        <MetricItem
          icon={Thermometer}
          label="Температура"
          value={metrics.temperature}
          metricKey="temperature"
        />
        <MetricItem
          icon={Droplets}
          label="Влажность"
          value={metrics.humidity}
          metricKey="humidity"
        />
        <MetricItem
          icon={TestTube}
          label="Питательные в-ва"
          value={metrics.nutrientLevel}
          metricKey="nutrientLevel"
        />
        <MetricItem
          icon={Activity}
          label="pH"
          value={metrics.phLevel}
          metricKey="phLevel"
        />
      </div>
      <p className="text-xs text-gray-400 mt-4">
        Последнее обновление: {formatDateTime(metrics.lastUpdated)}
      </p>
    </div>
  );
}