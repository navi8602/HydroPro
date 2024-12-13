// src/contexts/PlantContext.tsx
import { createContext, useContext, useReducer, ReactNode } from 'react';
import type { Plant } from '../types/system';

interface PlantState {
    plants: Record<string, Plant[]>; // systemId -> plants
    selectedPlant: Plant | null;
    loading: boolean;
    error: string | null;
}

type PlantAction =
    | { type: 'SET_PLANTS'; payload: { systemId: string; plants: Plant[] } }
    | { type: 'ADD_PLANT'; payload: { systemId: string; plant: Plant } }
    | { type: 'REMOVE_PLANT'; payload: { systemId: string; plantId: string } }
    | { type: 'UPDATE_PLANT'; payload: { systemId: string; plant: Plant } }
    | { type: 'SELECT_PLANT'; payload: Plant | null }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };

const PlantContext = createContext<{
    state: PlantState;
    dispatch: React.Dispatch<PlantAction>;
} | undefined>(undefined);

export function PlantProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(plantReducer, initialState);

    return (
        <PlantContext.Provider value={{ state, dispatch }}>
            {children}
        </PlantContext.Provider>
    );
}

export function usePlantContext() {
    const context = useContext(PlantContext);
    if (context === undefined) {
        throw new Error('usePlantContext must be used within a PlantProvider');
    }
    return context;
}
