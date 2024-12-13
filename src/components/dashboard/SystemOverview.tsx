// src/components/dashboard/SystemOverview.tsx
import { useEffect, useState } from 'react';
import { SystemService } from '../../api/services/system.service';
import { SystemHeader } from './SystemHeader';
import { SystemMetrics } from './SystemMetrics';
import { PlantList } from './PlantList';
import { QuickActions } from './QuickActions';
import type { System } from '../../types/system';

interface SystemOverviewProps {
  systemId: string;
}

export function SystemOverview({ systemId }: SystemOverviewProps) {
  const [system, setSystem] = useState<System | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSystem = async () => {
      try {
        const response = await SystemService.getSystem(systemId);
        setSystem(response.data);
      } catch (error) {
        console.error('Failed to fetch system:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSystem();
  }, [systemId]);

  if (loading) return <SystemOverviewLoader />;
  if (!system) return null;

  return (
      <div className="space-y-6">
        <SystemHeader
            name={system.name}
            type={system.type}
            status={system.status}
            lastUpdated={system.lastUpdated}
        />

        <QuickActions
            systemId={systemId}
            onAction={async (action) => {
              try {
                await SystemService.performAction(systemId, action);
                // Обновляем состояние системы после действия
                const response = await SystemService.getSystem(systemId);
                setSystem(response.data);
              } catch (error) {
                console.error('Failed to perform action:', error);
              }
            }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PlantList systemId={systemId} />
          </div>
          <div>
            <SystemMetrics
                systemId={systemId}
                metrics={system.metrics}
            />
          </div>
        </div>
      </div>
  );
}

function SystemOverviewLoader() {
  return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 animate-pulse">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg border border-gray-200 animate-pulse">
                <div className="h-12 bg-gray-200 rounded" />
              </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white p-4 rounded-lg border border-gray-200 animate-pulse">
                    <div className="space-y-4">
                      <div className="h-48 bg-gray-200 rounded" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 animate-pulse">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}
