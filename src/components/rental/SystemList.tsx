import { useState } from 'react';
import { HydroponicSystem } from '../../types/system';
import { SystemCard } from './SystemCard';
import { SystemRentalDialog } from './SystemRentalDialog';
import { Plus } from 'lucide-react';

interface SystemListProps {
  systems: HydroponicSystem[];
  onRentSystem: (systemId: string, months: number) => void;
}

export function SystemList({ systems, onRentSystem }: SystemListProps) {
  const [selectedSystem, setSelectedSystem] = useState<HydroponicSystem | null>(null);

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Доступные системы
            </h2>
            <p className="text-gray-500">
              Выберите подходящую систему для вашего пространства
            </p>
          </div>
          <button
            onClick={() => setSelectedSystem(systems[0])}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white 
                     rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Арендовать систему
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systems.map((system) => (
            <SystemCard
              key={system.id}
              system={system}
              onSelect={() => setSelectedSystem(system)}
            />
          ))}
        </div>
      </div>

      {selectedSystem && (
        <SystemRentalDialog
          isOpen={!!selectedSystem}
          onClose={() => setSelectedSystem(null)}
          onRent={onRentSystem}
          selectedSystem={selectedSystem}
        />
      )}
    </>
  );
}