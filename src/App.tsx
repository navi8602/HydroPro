
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
  const [rentedSystems, setRentedSystems] = useState<RentedSystem[]>([]);

  useEffect(() => {
    const fetchUserSystems = async () => {
      try {
        const response = await fetch('/api/user/systems', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('phone')}`
          }
        });
        const data = await response.json();
        setRentedSystems(data);
      } catch (error) {
        console.error('Error fetching user systems:', error);
      }
    };

    fetchUserSystems();
  }, []);

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
