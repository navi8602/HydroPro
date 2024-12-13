// server/utils/monitoring.js
export function analyzeMetrics(metrics) {
  const alerts = [];
  const { temperature, humidity, nutrientLevel, phLevel } = metrics;

  // Проверка температуры
  if (temperature < 18 || temperature > 28) {
    alerts.push({
      type: 'temperature',
      severity: temperature < 15 || temperature > 30 ? 'critical' : 'warning',
      message: `Temperature is ${temperature}°C (optimal range: 18-28°C)`
    });
  }

  // Проверка влажности
  if (humidity < 50 || humidity > 80) {
    alerts.push({
      type: 'humidity',
      severity: humidity < 40 || humidity > 90 ? 'critical' : 'warning',
      message: `Humidity is ${humidity}% (optimal range: 50-80%)`
    });
  }

  return {
    alerts,
    needsAttention: alerts.length > 0,
    criticalIssues: alerts.filter(a => a.severity === 'critical').length
  };
}

export function analyzePlantHealth(plant) {
  const latestData = plant.growthData[plant.growthData.length - 1];
  if (!latestData) return { needsAttention: false };

  const issues = [];
  const expectedHeight = calculateExpectedHeight(plant);

  if (latestData.height < expectedHeight * 0.8) {
    issues.push('Growth rate below expected');
  }

  if (latestData.healthScore < 70) {
    issues.push('Low health score');
  }

  return {
    issues,
    needsAttention: issues.length > 0,
    recommendations: generateRecommendations(issues)
  };
}

function calculateExpectedHeight(plant) {
  const daysSincePlanting = getDaysSince(plant.plantedDate);
  const growthRate = plant.type.expectedGrowthRate;
  return daysSincePlanting * growthRate;
}

function generateRecommendations(issues) {
  const recommendations = [];

  if (issues.includes('Growth rate below expected')) {
    recommendations.push('Check nutrient levels and light exposure');
  }

  if (issues.includes('Low health score')) {
    recommendations.push('Inspect for signs of disease or pest infestation');
  }

  return recommendations;
}
