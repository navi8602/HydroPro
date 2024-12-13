
import { useState, useEffect } from 'react';
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
            'Authorization': `${localStorage.getItem('phone')}`
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

  const handleRentSystem = async (systemId: string, months: number) => {
    try {
      const response = await fetch('/api/systems/rent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('phone')}`
        },
        body: JSON.stringify({ systemId, months })
      });

      if (!response.ok) {
        console.error('❌ Ошибка при аренде системы');
        throw new Error('Failed to rent system');
      }
      
      console.log('✅ Система успешно арендована');

      // Refresh systems list after renting
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
    } catch (error) {
      const errorDetails = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error renting system:', {
        error: errorDetails,
        systemId,
        months,
        response: await response.text() // Log raw response for debugging
      });
    }
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
