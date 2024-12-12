import { formatDate } from '../../utils/date';
import { Badge } from '../ui/Badge';
import { calculateDaysRemaining } from '../../utils/rental';
import { Settings } from 'lucide-react';
import type { RentedSystem } from '../../types/system';

interface SystemHeaderProps {
  system: RentedSystem;
  onSettingsClick: () => void;
}

export function SystemHeader({ system, onSettingsClick }: SystemHeaderProps) {
  const daysRemaining = calculateDaysRemaining(system.endDate);
  
  return (
    <div className="flex justify-between items-start">
      <div>
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold text-gray-900">{system.name}</h2>
          <Badge variant={daysRemaining < 30 ? 'warning' : 'info'}>
            {daysRemaining} days remaining
          </Badge>
        </div>
        <p className="text-sm text-gray-500">
          Rental Period: {system.rentalPeriod} months
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {formatDate(system.startDate)} - {formatDate(system.endDate)}
          </p>
          <p className="text-sm font-medium text-gray-900">
            Capacity: {system.plants.length}/{system.capacity}
          </p>
        </div>
        <button
          onClick={onSettingsClick}
          className="p-2 rounded-full hover:bg-gray-100"
          title="System Settings"
        >
          <Settings className="h-5 w-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
}