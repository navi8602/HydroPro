import { useEffect, useState } from 'react';
import { PlantService } from '../../api/services/plant.service';
import { PlantProgressBar } from './PlantProgressBar';
import type { Plant } from '../../types/plant';

interface PlantCardProps {
  plantId: string;
  onStatusChange?: (status: Plant['status']) => void;
}

export function PlantCard({ plantId, onStatusChange }: PlantCardProps) {
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const response = await PlantService.getPlant(plantId);
        setPlant(response.data);
        onStatusChange?.(response.data.status);
      } catch (error) {
        console.error('Failed to fetch plant:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlant();
  }, [plantId, onStatusChange]);

  if (loading) return <PlantCardLoader />;
  if (!plant) return null;

  const statusColors = {
    healthy: 'text-green-600',
    warning: 'text-yellow-600',
    critical: 'text-red-600'
  };

  const statusMessages = {
    healthy: 'Здоровое растение',
    warning: 'Требует внимания',
    critical: 'Критическое состояние'
  };

  return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {plant.imageUrl && (
            <img
                src={plant.imageUrl}
                alt={plant.name}
                className="w-full h-48 object-cover"
            />
        )}

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900">{plant.name}</h3>
            <span className={`text-sm font-medium ${statusColors[plant.status]}`}>
            {statusMessages[plant.status]}
          </span>
          </div>

          <PlantProgressBar
              plantedDate={plant.plantedDate}
              expectedHarvestDate={plant.expectedHarvestDate}
              status={plant.status}
          />

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <span className="mr-2">🌱</span>
              Посажено: {new Date(plant.plantedDate).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <span className="mr-2">📅</span>
              Сбор: {new Date(plant.expectedHarvestDate).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <span className="mr-2">📏</span>
              Позиция: {plant.position}
            </div>
            <div className="flex items-center">
              <span className="mr-2">🌡️</span>
              {plant.currentTemp}°C
            </div>
          </div>

          {plant.lastMaintenance && (
              <p className="mt-4 text-xs text-gray-400">
                Последнее обслуживание: {new Date(plant.lastMaintenance).toLocaleString()}
              </p>
          )}
        </div>
      </div>
  );
}

function PlantCardLoader() {
  return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
        <div className="w-full h-48 bg-gray-200" />
        <div className="p-4 space-y-4">
          <div className="flex justify-between">
            <div className="h-6 w-24 bg-gray-200 rounded" />
            <div className="h-6 w-32 bg-gray-200 rounded" />
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 w-full bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
  );
}
