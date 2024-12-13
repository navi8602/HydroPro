import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { AuthForm } from '../components/auth/AuthForm';
import { DashboardPage } from '../pages/DashboardPage';
import { SystemsPage } from '../pages/SystemsPage';
import { PlantsPage } from '../pages/PlantsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

const router = createBrowserRouter([
    {
        path: '/auth',
        element: <AuthForm />
    },
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: '/',
                element: <DashboardPage />
            },
            {
                path: '/systems',
                element: <SystemsPage />
            },
            {
                path: '/plants',
                element: <PlantsPage />
            },
            {
                path: '/profile',
                element: <ProfilePage />
            }
        ]
    }
]);

export function AppRouter() {
    return <RouterProvider router={router} />;
}
