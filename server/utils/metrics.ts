// server/utils/metrics.ts
export const calculateGrowthRate = (
    initialHeight: number,
    currentHeight: number,
    daysPassed: number
): number => {
    return (currentHeight - initialHeight) / daysPassed;
};

export const calculateHealthScore = (
    temperature: number,
    humidity: number,
    nutrientLevel: number,
    phLevel: number
): number => {
    const scores = {
        temperature: getTemperatureScore(temperature),
        humidity: getHumidityScore(humidity),
        nutrientLevel: getNutrientScore(nutrientLevel),
        phLevel: getPhScore(phLevel)
    };

    return Object.values(scores).reduce((sum, score) => sum + score, 0) / 4;
};

export const predictHarvestDate = (
    plantedDate: Date,
    currentHeight: number,
    targetHeight: number,
    growthRate: number
): Date => {
    const remainingGrowth = targetHeight - currentHeight;
    const daysNeeded = remainingGrowth / growthRate;
    const harvestDate = new Date(plantedDate);
    harvestDate.setDate(harvestDate.getDate() + daysNeeded);
    return harvestDate;
};
