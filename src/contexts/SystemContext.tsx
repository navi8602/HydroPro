// src/contexts/SystemContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { systemService } from '../services/system';
import type { RentedSystem } from '../types/system';

interface SystemContextValue {
    systems: RentedSystem[];
    isLoading: boolean;
    error: Error | null;
    refreshSystems: () => Promise<void>;
    deleteSystem: (systemId: string) => Promise<void>;
}

const SystemContext = createContext<SystemContextValue | undefined>(undefined);

export function SystemProvider({ children }: { children: ReactNode }) {
    const [systems, setSystems] = useState<RentedSystem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const refreshSystems = async () => {
        try {
            setIsLoading(true);
            const data = await systemService.getSystems();
            setSystems(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch systems'));
        } finally {
            setIsLoading(false);
        }
    };

    const deleteSystem = async (systemId: string) => {
        await systemService.deleteSystem(systemId);
        setSystems(prev => prev.filter(s => s.id !== systemId));
    };

    useEffect(() => {
        refreshSystems();
    }, []);

    return (
        <SystemContext.Provider value={{
            systems,
            isLoading,
            error,
            refreshSystems,
            deleteSystem
        }}>
            {children}
        </SystemContext.Provider>
    );
}

export function useSystem() {
    const context = useContext(SystemContext);
    if (!context) {
        throw new Error('useSystem must be used within SystemProvider');
    }
    return context;
}
