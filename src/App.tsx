
import { useState } from 'react';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate,
  UNSAFE_DataRouterContext,
  UNSAFE_DataRouterStateContext 
} from 'react-router-dom';
import { startTransition } from 'react';

// Enable v7 features
UNSAFE_DataRouterContext.provider = {
  ...UNSAFE_DataRouterContext.provider,
  v7_startTransition: startTransition
};
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { SystemsPage } from './pages/SystemsPage';
import { PlantsPage } from './pages/PlantsPage';
import { LoginPage } from './pages/LoginPage';
import { UsersPage } from './pages/UsersPage';
import { HYDROPONIC_SYSTEMS } from './data/systems';
import { NotificationProvider } from './contexts/NotificationContext';
import type { RentedSystem } from './types/system';

function App() {
  const [rentedSystems, setRentedSystems] = useState<RentedSystem[]>([
    {
      id: '1',
      name: 'HydroPro 2000',
      capacity: 8,
      rentalPeriod: 12,
      startDate: '2024-03-01',
      endDate: '2025-03-01',
      plants: [
        {
          id: '1',
          name: 'Базилик',
          position: 1,
          plantedDate: '2024-03-01',
          expectedHarvestDate: '2024-04-01',
          status: 'healthy'
        },
        {
          id: '2',
          name: 'Салат',
          position: 2,
          plantedDate: '2024-03-01',
          expectedHarvestDate: '2024-04-01',
          status: 'warning'
        }
      ],
      metrics: {
        temperature: 23,
        humidity: 65,
        nutrientLevel: 80,
        phLevel: 6.5,
        lastUpdated: new Date().toISOString()
      }
    }
  ]);

  const handleRentSystem = (systemId: string, months: number) => {
    const system = HYDROPONIC_SYSTEMS.find(s => s.id === systemId);
    if (!system) return;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + months);

    const newSystem: RentedSystem = {
      id: crypto.randomUUID(),
      name: system.name,
      capacity: system.capacity,
      rentalPeriod: months as 3 | 6 | 12,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      plants: [],
      metrics: {
        temperature: 22,
        humidity: 60,
        nutrientLevel: 100,
        phLevel: 6.0,
        lastUpdated: new Date().toISOString()
      }
    };

    setRentedSystems(prev => [...prev, newSystem]);
  };

  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage rentedSystems={rentedSystems} />} />
            <Route path="/systems" element={<SystemsPage onRentSystem={handleRentSystem} />} />
            <Route path="/plants" element={<PlantsPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;
