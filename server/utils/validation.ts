// server/utils/validation.ts
export const validateMetrics = (metrics: SystemMetrics): ValidationResult => {
    const errors: string[] = [];

    if (metrics.temperature < 15 || metrics.temperature > 35) {
        errors.push('Temperature must be between 15°C and 35°C');
    }

    if (metrics.humidity < 30 || metrics.humidity > 90) {
        errors.push('Humidity must be between 30% and 90%');
    }

    if (metrics.nutrientLevel < 0 || metrics.nutrientLevel > 100) {
        errors.push('Nutrient level must be between 0 and 100');
    }

    if (metrics.phLevel < 5.5 || metrics.phLevel > 7.5) {
        errors.push('pH level must be between 5.5 and 7.5');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};
