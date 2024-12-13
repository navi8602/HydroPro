
import { 
  BrowserRouter as Router, 
  Routes, 
  Route,
  future
} from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { SystemsPage } from './pages/SystemsPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { useEffect, useState } from 'react';
import { RentedSystem } from './types/system';
import { getAuthToken } from './utils/auth';

// Configure future flags
future.v7_startTransition = true;
future.v7_relativeSplatPath = true;

export default function App() {
  const [rentedSystems, setRentedSystems] = useState<RentedSystem[]>([]);

  useEffect(() => {
    const fetchSystems = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;
        
        const response = await fetch('/api/systems/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setRentedSystems(data);
        }
      } catch (error) {
        console.error('Error fetching systems:', error);
      }
    };

    fetchSystems();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage rentedSystems={rentedSystems} />} />
          <Route path="/dashboard" element={<DashboardPage rentedSystems={rentedSystems} />} />
          <Route path="/systems" element={<SystemsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
}
