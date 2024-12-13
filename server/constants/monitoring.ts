// server/constants/monitoring.ts
export const SYSTEM_THRESHOLDS = {
    temperature: { min: 18, max: 28 },
    humidity: { min: 50, max: 80 },
    phLevel: { min: 5.5, max: 7.5 },
    nutrientLevel: { min: 60, max: 100 }
};

export const MONITORING_INTERVALS = {
    systemMetrics: 5 * 60 * 1000, // 5 minutes
    plantMetrics: 30 * 60 * 1000  // 30 minutes
};

export const ALERT_THRESHOLDS = {
    temperature: {
        warning: 2,  // ±2°C from optimal
        critical: 4  // ±4°C from optimal
    },
    humidity: {
        warning: 5,  // ±5% from optimal
        critical: 10 // ±10% from optimal
    }
    // ... other thresholds
};
