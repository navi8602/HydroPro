// src/contexts/MonitoringContext.tsx
import { createContext, useContext, useReducer, ReactNode } from 'react';
import type { EnvironmentData, Alert, MaintenanceTask } from '../types/monitoring';

interface MonitoringState {
    environmentData: EnvironmentData[];
    alerts: Alert[];
    tasks: MaintenanceTask[];
    loading: boolean;
    error: string | null;
}

type MonitoringAction =
    | { type: 'SET_ENVIRONMENT_DATA'; payload: EnvironmentData[] }
    | { type: 'UPDATE_ENVIRONMENT_DATA'; payload: EnvironmentData }
    | { type: 'SET_ALERTS'; payload: Alert[] }
    | { type: 'UPDATE_ALERT'; payload: Alert }
    | { type: 'SET_TASKS'; payload: MaintenanceTask[] }
    | { type: 'UPDATE_TASK'; payload: MaintenanceTask }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };

const MonitoringContext = createContext<{
    state: MonitoringState;
    dispatch: React.Dispatch<MonitoringAction>;
} | undefined>(undefined);

export function MonitoringProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(monitoringReducer, initialState);

    return (
        <MonitoringContext.Provider value={{ state, dispatch }}>
            {children}
        </MonitoringContext.Provider>
    );
}

export function useMonitoring() {
    const context = useContext(MonitoringContext);
    if (context === undefined) {
        throw new Error('useMonitoring must be used within a MonitoringProvider');
    }
    return context;
}
