import { LucideIcon } from 'lucide-react';
import { getMetricStatusColor, formatMetricValue } from '../../utils/metrics';
import { SYSTEM_THRESHOLDS } from '../../utils/constants';

interface MetricItemProps {
  icon: LucideIcon;
  label: string;
  value: number;
  metricKey: keyof typeof SYSTEM_THRESHOLDS;
}

export function MetricItem({ icon: Icon, label, value, metricKey }: MetricItemProps) {
  const statusColor = getMetricStatusColor(value, SYSTEM_THRESHOLDS[metricKey]);
  const formattedValue = formatMetricValue(value, metricKey);
  const threshold = SYSTEM_THRESHOLDS[metricKey];

  return (
    <div className="flex items-center space-x-3">
      <Icon className={`h-5 w-5 ${statusColor}`} />
      <div className="flex-1">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{formattedValue}</p>
        <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${statusColor.replace('text-', 'bg-')}`}
            style={{
              width: `${Math.min(100, (value / threshold.max) * 100)}%`,
            }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Range: {threshold.min}{threshold.unit} - {threshold.max}{threshold.unit}
        </p>
      </div>
    </div>
  );
}