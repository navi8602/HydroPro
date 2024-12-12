import { useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { Plant } from '../../types/system';
import { PlantType } from '../../types/plants';
import { PLANTS } from '../../data/plants';
import { PlantCategorySelector } from './PlantCategorySelector';
import { PlantCard } from './PlantCard';
import { 
  checkPlantCompatibility, 
  getCurrentPlantQuantity,
  getPlantQuantityLimit,
  checkSpaceRequirements 
} from '../../utils/plantCompatibility';
import { getAvailablePositions } from '../../utils/plants';
import { Info } from 'lucide-react';

interface AddPlantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (plant: Omit<Plant, 'id' | 'status'>) => void;
  occupiedPositions: number[];
  capacity: number;
  currentPlants: Plant[];
}

export function AddPlantDialog({ 
  isOpen, 
  onClose, 
  onAdd, 
  occupiedPositions, 
  capacity,
  currentPlants 
}: AddPlantDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<PlantType | null>(null);
  const [position, setPosition] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');

  const availablePositions = getAvailablePositions(occupiedPositions, capacity);
  const remainingSpace = capacity - (occupiedPositions?.length || 0);

  // Фильтрация растений по категории и поиску
  const filteredPlants = PLANTS.filter(plant => {
    const matchesCategory = !selectedCategory || plant.category === selectedCategory;
    const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlant) return;

    const plantedDate = new Date().toISOString();
    const expectedHarvestDate = new Date();
    expectedHarvestDate.setDate(expectedHarvestDate.getDate() + selectedPlant.growthDays);

    onAdd({
      name: selectedPlant.name,
      position,
      plantedDate,
      expectedHarvestDate: expectedHarvestDate.toISOString(),
    });
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Добавить новое растение">
      <div className="space-y-6">
        <div className="sticky top-0 bg-white z-10 pb-4">
          <input
            type="text"
            placeholder="Поиск растений..."
            className="w-full px-4 py-2 border rounded-lg mb-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <PlantCategorySelector
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        <div className="grid gap-4 max-h-[400px] overflow-y-auto">
          {filteredPlants.map(plant => {
            const isCompatible = checkPlantCompatibility(currentPlants, plant.id);
            const currentQuantity = getCurrentPlantQuantity(plant.id, currentPlants);
            const quantityAllowed = getPlantQuantityLimit(plant.id, currentQuantity);
            const hasSpace = checkSpaceRequirements(plant.id, remainingSpace);

            return (
              <PlantCard
                key={plant.id}
                plant={plant}
                isSelected={selectedPlant?.id === plant.id}
                onSelect={() => setSelectedPlant(plant)}
                isCompatible={isCompatible && quantityAllowed && hasSpace}
                currentQuantity={currentQuantity}
                remainingSpace={remainingSpace}
              />
            );
          })}
        </div>

        {selectedPlant && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Позиция в системе
            </label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm"
              value={position}
              onChange={(e) => setPosition(Number(e.target.value))}
            >
              {availablePositions.map((pos) => (
                <option key={pos} value={pos}>
                  Позиция {pos}
                </option>
              ))}
            </select>
            
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <Info className="h-4 w-4 mr-1" />
              <span>
                Свободно позиций: {availablePositions.length} из {capacity}
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white 
                     border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedPlant}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 
                     border border-transparent rounded-md hover:bg-indigo-700
                     disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Добавить растение
          </button>
        </div>
      </div>
    </Dialog>
  );
}