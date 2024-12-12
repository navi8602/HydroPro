import { PlantType } from '../types/plants';

export const PLANT_CATEGORIES = {
  herbs: 'Травы',
  vegetables: 'Овощи',
  greens: 'Зелень',
  fruits: 'Фрукты'
} as const;

export const PLANTS: PlantType[] = [
  {
    id: 'basil',
    name: 'Базилик',
    category: 'herbs',
    growthDays: 30,
    optimalTemp: { min: 20, max: 25 },
    optimalHumidity: { min: 60, max: 75 },
    description: 'Ароматная трава, идеальная для начинающих. Быстрый рост, частый урожай.',
    difficulty: 'easy',
    spacing: 1,
    nutrients: ['Азот', 'Фосфор', 'Калий'],
    companionPlants: ['tomato', 'pepper'],
    incompatiblePlants: ['sage'],
    maxQuantity: 4,
    minDistance: 1,
    imageUrl: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733'
  },
  {
    id: 'tomato',
    name: 'Томат черри',
    category: 'vegetables',
    growthDays: 60,
    optimalTemp: { min: 20, max: 26 },
    optimalHumidity: { min: 65, max: 80 },
    description: 'Компактные томаты, идеальны для гидропоники. Требуют поддержки для роста.',
    difficulty: 'hard',
    spacing: 3,
    nutrients: ['Азот', 'Фосфор', 'Калий', 'Кальций', 'Магний'],
    companionPlants: ['basil', 'parsley'],
    incompatiblePlants: ['potato', 'cucumber'],
    maxQuantity: 2,
    minDistance: 2,
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa'
  },
  {
    id: 'lettuce',
    name: 'Салат',
    category: 'greens',
    growthDays: 45,
    optimalTemp: { min: 15, max: 22 },
    optimalHumidity: { min: 60, max: 70 },
    description: 'Быстрорастущий листовой салат, идеален для начинающих.',
    difficulty: 'easy',
    spacing: 2,
    nutrients: ['Азот', 'Кальций'],
    companionPlants: ['carrot', 'radish'],
    incompatiblePlants: [],
    maxQuantity: 6,
    minDistance: 1,
    imageUrl: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1'
  },
  {
    id: 'spinach',
    name: 'Шпинат',
    category: 'greens',
    growthDays: 40,
    optimalTemp: { min: 16, max: 23 },
    optimalHumidity: { min: 60, max: 70 },
    description: 'Богатая питательными веществами листовая культура.',
    difficulty: 'medium',
    spacing: 1,
    nutrients: ['Азот', 'Железо'],
    companionPlants: ['lettuce', 'peas'],
    incompatiblePlants: [],
    maxQuantity: 8,
    minDistance: 1,
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb'
  }
];