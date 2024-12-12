import { Plant } from '../../types/system';
import { Leaf, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/date';
import { Badge } from '../ui/Badge';

interface PlantCardProps {
  plant: Plant;
}

export function PlantCard({ plant }: PlantCardProps) {
  const statusVariants: Record<Plant['status'], 'success' | 'warning' | 'error'> = {
    healthy: 'success',
    warning: 'warning',
    critical: 'error'
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Leaf className="h-4 w-4 text-green-500" />
          <span className="font-medium">{plant.name}</span>
        </div>
        <Badge variant={statusVariants[plant.status]}>
          {plant.status}
        </Badge>
      </div>
      <div className="space-y-1">
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="h-3 w-3 mr-1" />
          Planted: {formatDate(plant.plantedDate)}
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="h-3 w-3 mr-1" />
          Harvest: {formatDate(plant.expectedHarvestDate)}
        </div>
      </div>
    </div>
  );
}