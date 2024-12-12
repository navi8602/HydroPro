import { PLANT_CATEGORIES } from '../../data/plants';
import { Leaf, Carrot, Sprout, Apple } from 'lucide-react';

interface PlantCategorySelectorProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CATEGORY_ICONS = {
  herbs: Leaf,
  vegetables: Carrot,
  greens: Sprout,
  fruits: Apple
} as const;

export function PlantCategorySelector({ 
  selectedCategory, 
  onSelectCategory 
}: PlantCategorySelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
      <button
        onClick={() => onSelectCategory(null)}
        className={`
          flex items-center justify-center p-3 rounded-lg text-sm font-medium
          transition-all border-2
          ${!selectedCategory 
            ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
            : 'border-gray-200 hover:border-gray-300 text-gray-600'}
        `}
      >
        <Sprout className="h-5 w-5 mr-2" />
        Все растения
      </button>

      {Object.entries(PLANT_CATEGORIES).map(([key, label]) => {
        const Icon = CATEGORY_ICONS[key as keyof typeof CATEGORY_ICONS];
        return (
          <button
            key={key}
            onClick={() => onSelectCategory(key)}
            className={`
              flex items-center justify-center p-3 rounded-lg text-sm font-medium
              transition-all border-2
              ${selectedCategory === key
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-600'}
            `}
          >
            <Icon className="h-5 w-5 mr-2" />
            {label}
          </button>
        );
      })}
    </div>
  );
}