import { Plant } from '../types/system';
import { PlantType } from '../types/plants';
import { PLANTS } from '../data/plants';

export function checkPlantCompatibility(
  currentPlants: Plant[],
  newPlantId: string
): boolean {
  const newPlant = PLANTS.find(p => p.id === newPlantId);
  if (!newPlant) return false;

  // Если нет текущих растений, то совместимость всегда true
  if (!currentPlants || currentPlants.length === 0) return true;

  // Проверяем совместимость с каждым существующим растением
  return currentPlants.every(currentPlant => {
    const plantType = PLANTS.find(p => p.name === currentPlant.name);
    if (!plantType) return false;

    // Проверяем взаимную совместимость
    return !plantType.incompatiblePlants.includes(newPlantId) &&
           !newPlant.incompatiblePlants.includes(plantType.id);
  });
}

export function getPlantQuantityLimit(
  plantId: string,
  currentQuantity: number
): boolean {
  const plant = PLANTS.find(p => p.id === plantId);
  if (!plant || !plant.maxQuantity) return true;
  return currentQuantity < plant.maxQuantity;
}

export function getCurrentPlantQuantity(
  plantId: string,
  currentPlants: Plant[]
): number {
  if (!currentPlants) return 0;
  
  const plant = PLANTS.find(p => p.id === plantId);
  if (!plant) return 0;

  return currentPlants.filter(p => p.name === plant.name).length;
}

export function checkSpaceRequirements(
  plantId: string,
  remainingSpace: number
): boolean {
  const plant = PLANTS.find(p => p.id === plantId);
  if (!plant) return false;
  return remainingSpace >= plant.spacing;
}

export function calculateTotalSpaceRequired(entries: Array<{
  plantId: string;
  quantity: number;
}>): number {
  return entries.reduce((total, entry) => {
    const plant = PLANTS.find(p => p.id === entry.plantId);
    if (!plant) return total;
    return total + (plant.spacing * entry.quantity);
  }, 0);
}

export function validatePlantCombination(entries: Array<{
  plantId: string;
  quantity: number;
}>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Проверяем совместимость всех растений между собой
  for (let i = 0; i < entries.length; i++) {
    const currentPlant = PLANTS.find(p => p.id === entries[i].plantId);
    if (!currentPlant) continue;

    for (let j = i + 1; j < entries.length; j++) {
      const otherPlant = PLANTS.find(p => p.id === entries[j].plantId);
      if (!otherPlant) continue;

      if (
        currentPlant.incompatiblePlants.includes(otherPlant.id) ||
        otherPlant.incompatiblePlants.includes(currentPlant.id)
      ) {
        errors.push(
          `${currentPlant.name} несовместим с ${otherPlant.name}`
        );
      }
    }

    // Проверяем количество каждого растения
    if (currentPlant.maxQuantity && entries[i].quantity > currentPlant.maxQuantity) {
      errors.push(
        `Максимальное количество для ${currentPlant.name}: ${currentPlant.maxQuantity}`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}