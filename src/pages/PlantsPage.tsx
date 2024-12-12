import { useState } from 'react';
import { PLANTS, PLANT_CATEGORIES } from '../data/plants';
import { PlantCatalog } from '../components/plants/PlantCatalog';
import { PlantFilters } from '../components/plants/PlantFilters';
import { PlantDetailsDialog } from '../components/plants/PlantDetailsDialog';
import type { PlantType } from '../types/plants';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PlantsPage() {
  const [selectedPlant, setSelectedPlant] = useState<PlantType | null>(null);
  const [filters, setFilters] = useState({
    categories: [] as string[],
    difficulty: [] as ('easy' | 'medium' | 'hard')[],
    growthTime: {
      min: 0,
      max: Math.max(...PLANTS.map(p => p.growthDays))
    },
    searchQuery: ''
  });

  const filteredPlants = PLANTS.filter(plant => {
    const matchesCategory = filters.categories.length === 0 || 
      filters.categories.includes(plant.category);
    const matchesDifficulty = filters.difficulty.length === 0 || 
      filters.difficulty.includes(plant.difficulty);
    const matchesGrowthTime = plant.growthDays >= filters.growthTime.min && 
      plant.growthDays <= filters.growthTime.max;
    const matchesSearch = plant.name.toLowerCase()
      .includes(filters.searchQuery.toLowerCase()) ||
      plant.description.toLowerCase()
        .includes(filters.searchQuery.toLowerCase());

    return matchesCategory && matchesDifficulty && matchesGrowthTime && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Вернуться к дашборду
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Каталог растений
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <PlantFilters
            filters={filters}
            onFiltersChange={setFilters}
            categories={PLANT_CATEGORIES}
          />
        </div>

        <div className="lg:col-span-3">
          <PlantCatalog
            plants={filteredPlants}
            onSelectPlant={setSelectedPlant}
          />
        </div>
      </div>

      {selectedPlant && (
        <PlantDetailsDialog
          plant={selectedPlant}
          isOpen={!!selectedPlant}
          onClose={() => setSelectedPlant(null)}
        />
      )}
    </div>
  );
}