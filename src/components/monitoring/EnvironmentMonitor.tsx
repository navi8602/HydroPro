import { useState } from 'react';
import { EnvironmentData } from '../../types/monitoring';
import { Line } from 'react-chartjs-2';
import { 
  Thermometer, Droplets, Sun, 
  TestTube, Activity, Calendar 
} from 'lucide-react';
import '../../utils/chartSetup';

interface EnvironmentMonitorProps {
  data: EnvironmentData[];
  timeRange: '24h' | '7d' | '30d';
  onTimeRangeChange: (range: '24h' | '7d' | '30d') => void;
}

export function EnvironmentMonitor({ 
  data, 
  timeRange, 
  onTimeRangeChange 
}: EnvironmentMonitorProps) {
  const [selectedMetric, setSelectedMetric] = useState<keyof Omit<EnvironmentData, 'timestamp'>>('temperature');

  const metrics = [
    { key: 'temperature', label: 'Температура', icon: Thermometer, unit: '°C', color: 'rgb(239, 68, 68)' },
    { key: 'humidity', label: 'Влажность', icon: Droplets, unit: '%', color: 'rgb(59, 130, 246)' },
    { key: 'lightLevel', label: 'Освещение', icon: Sun, unit: 'lux', color: 'rgb(245, 158, 11)' },
    { key: 'phLevel', label: 'pH', icon: TestTube, unit: '', color: 'rgb(16, 185, 129)' },
    { key: 'nutrientLevel', label: 'Питательные в-ва', icon: Activity, unit: 'ppm', color: 'rgb(139, 92, 246)' }
  ] as const;

  const chartData = {
    labels: data.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [{
      label: metrics.find(m => m.key === selectedMetric)?.label,
      data: data.map(d => d[selectedMetric]),
      borderColor: metrics.find(m => m.key === selectedMetric)?.color,
      backgroundColor: metrics.find(m => m.key === selectedMetric)?.color,
      tension: 0.1,
      pointRadius: 2,
      borderWidth: 2,
      fill: false
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        title: {
          display: true,
          text: metrics.find(m => m.key === selectedMetric)?.unit
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {metrics.map(({ key, label, icon: Icon, color }) => (
            <button
              key={key}
              onClick={() => setSelectedMetric(key)}
              className={`
                flex items-center px-3 py-2 rounded-lg text-sm font-medium
                ${selectedMetric === key 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-500 hover:text-gray-700'}
              `}
            >
              <Icon className="h-4 w-4 mr-1" style={{ color }} />
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value as '24h' | '7d' | '30d')}
            className="text-sm border-gray-300 rounded-md"
          >
            <option value="24h">24 часа</option>
            <option value="7d">7 дней</option>
            <option value="30d">30 дней</option>
          </select>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200" style={{ height: '400px' }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}