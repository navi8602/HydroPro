// src/components/dashboard/SystemAnalytics.tsx
import { useEffect, useState } from 'react';
import { AnalyticsService } from '../../api/services/analytics.service';
import { Line } from 'react-chartjs-2';
import type { SystemAnalytics as SystemAnalyticsType } from '../../types/analytics';

interface SystemAnalyticsProps {
  systemId: string;
  timeRange: '24h' | '7d' | '30d';
}

export function SystemAnalytics({ systemId, timeRange }: SystemAnalyticsProps) {
  const [analytics, setAnalytics] = useState<SystemAnalyticsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await AnalyticsService.getSystemAnalytics(systemId, timeRange);
        setAnalytics(response.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [systemId, timeRange]);

  if (loading) return <AnalyticsLoader />;
  if (!analytics) return null;

  const chartData = {
    labels: analytics.timePoints,
    datasets: [
      {
        label: 'Температура (°C)',
        data: analytics.temperature,
        borderColor: 'rgb(239, 68, 68)',
        tension: 0.1
      },
      {
        label: 'Влажность (%)',
        data: analytics.humidity,
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.1
      },
      {
        label: 'pH',
        data: analytics.ph,
        borderColor: 'rgb(16, 185, 129)',
        tension: 0.1
      }
    ]
  };

  return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Аналитика системы</h3>
          <div className="h-80">
            <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  interaction: {
                    mode: 'index',
                    intersect: false,
                  },
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricSummary
              label="Эффективность"
              value={`${analytics.efficiency}%`}
              trend={analytics.efficiencyTrend}
              icon="📈"
          />
          <MetricSummary
              label="Расход воды"
              value={`${analytics.waterUsage}л/день`}
              trend={analytics.waterUsageTrend}
              icon="💧"
          />
          <MetricSummary
              label="Энергопотребление"
              value={`${analytics.powerUsage}кВт/ч`}
              trend={analytics.powerUsageTrend}
              icon="⚡"
          />
        </div>
      </div>
  );
}

interface MetricSummaryProps {
  label: string;
  value: string;
  trend: number;
  icon: string;
}

function MetricSummary({ label, value, trend, icon }: MetricSummaryProps) {
  const trendColor = trend > 0 ? 'text-green-600' : 'text-red-600';
  const trendIcon = trend > 0 ? '↑' : '↓';

  return (
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{icon}</span>
            <span className="font-medium">{label}</span>
          </div>
          <span className="text-lg font-semibold">{value}</span>
        </div>
        <div className={`mt-2 text-sm ${trendColor}`}>
          {trendIcon} {Math.abs(trend)}% за период
        </div>
      </div>
  );
}

function AnalyticsLoader() {
  return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="h-80 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg border border-gray-200 animate-pulse">
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-8 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
          ))}
        </div>
      </div>
  );
}
