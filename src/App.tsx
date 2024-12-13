
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider } from './contexts/NotificationContext';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { SystemsPage } from './pages/SystemsPage';
import { PlantsPage } from './pages/PlantsPage';
import { UsersPage } from './pages/UsersPage';
import { useState, useEffect } from 'react';
import { RentedSystem } from './types/system';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AuthRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function App() {
  const [rentedSystems, setRentedSystems] = useState<RentedSystem[]>([]);

  const handleRentSystem = async (systemId: string, months: number) => {
    try {
      const response = await fetch('http://0.0.0.0:3002/api/systems/rent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ systemId, months })
      });

      if (!response.ok) {
        throw new Error('Failed to rent system');
      }

      await fetchUserSystems();
    } catch (error) {
      console.error('Error renting system:', error);
      throw error;
    }
  };

  const fetchUserSystems = async () => {
    try {
      const response = await fetch('/api/systems/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch systems');
      }
      const data = await response.json();
      setRentedSystems(data);
    } catch (error) {
      console.error('Error fetching user systems:', error);
    }
  };

  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={
            <AuthRoute>
              <LoginPage />
            </AuthRoute>
          } />
          <Route element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<DashboardPage rentedSystems={rentedSystems} />} />
            <Route path="/systems" element={<SystemsPage onRentSystem={handleRentSystem} />} />
            <Route path="/plants" element={<PlantsPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}
