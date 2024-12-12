import { Slider } from '../ui/Slider';
import { 
  Search, Filter, Leaf, Thermometer, 
  Droplets, Clock, X 
} from 'lucide-react';

interface PlantFiltersProps {
  filters: {
    categories: string[];
    difficulty: ('easy' | 'medium' | 'hard')[];
    growthTime: {
      min: number;
      max: number;
    };
    searchQuery: string;
  };
  onFiltersChange: (filters: PlantFiltersProps['filters']) => void;
  categories: Record<string, string>;
}

export function PlantFilters({ 
  filters, 
  onFiltersChange,
  categories 
}: PlantFiltersProps) {
  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const toggleDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    const newDifficulty = filters.difficulty.includes(difficulty)
      ? filters.difficulty.filter(d => d !== difficulty)
      : [...filters.difficulty, difficulty];
    onFiltersChange({ ...filters, difficulty: newDifficulty });
  };

  const clearFilters = () => {
    onFiltersChange({
      categories: [],
      difficulty: [],
      growthTime: {
        min: 0,
        max: Math.max(...Object.values(categories).map(c => c.length))
      },
      searchQuery: ''
    });
  };

  const hasActiveFilters = filters.categories.length > 0 || 
    filters.difficulty.length > 0 || 
    filters.searchQuery || 
    filters.growthTime.min > 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Фильтры</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-700 flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              Сбросить
            </button>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 
                           h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск растений..."
            value={filters.searchQuery}
            onChange={(e) => onFiltersChange({
              ...filters,
              searchQuery: e.target.value
            })}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-3">Категории</h4>
        <div className="space-y-2">
          {Object.entries(categories).map(([key, label]) => (
            <button
              key={key}
              onClick={() => toggleCategory(key)}
              className={`
                w-full flex items-center justify-between px-3 py-2 rounded-lg
                text-sm transition-colors
                ${filters.categories.includes(key)
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-50'}
              `}
            >
              <span>{label}</span>
              <Leaf className={`h-4 w-4 ${
                filters.categories.includes(key)
                  ? 'text-indigo-600'
                  : 'text-gray-400'
              }`} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-3">Сложность выращивания</h4>
        <div className="space-y-2">
          {[
            { value: 'easy', label: 'Легко', color: 'green' },
            { value: 'medium', label: 'Средне', color: 'yellow' },
            { value: 'hard', label: 'Сложно', color: 'red' }
          ].map(({ value, label, color }) => (
            <button
              key={value}
              onClick={() => toggleDifficulty(value as 'easy' | 'medium' | 'hard')}
              className={`
                w-full flex items-center justify-between px-3 py-2 rounded-lg
                text-sm transition-colors
                ${filters.difficulty.includes(value as 'easy' | 'medium' | 'hard')
                  ? `bg-${color}-50 text-${color}-700`
                  : 'text-gray-700 hover:bg-gray-50'}
              `}
            >
              <span>{label}</span>
              <Filter className={`h-4 w-4 ${
                filters.difficulty.includes(value as 'easy' | 'medium' | 'hard')
                  ? `text-${color}-600`
                  : 'text-gray-400'
              }`} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-3">Время роста (дни)</h4>
        <Slider
          min={0}
          max={90}
          step={5}
          value={[filters.growthTime.min, filters.growthTime.max]}
          onValueChange={([min, max]) => onFiltersChange({
            ...filters,
            growthTime: { min, max }
          })}
        />
        <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
          <span>{filters.growthTime.min} дней</span>
          <span>{filters.growthTime.max} дней</span>
        </div>
      </div>
    </div>
  );
}