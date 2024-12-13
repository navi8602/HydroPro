// src/components/layout/Layout.tsx
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export function Layout({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth" />;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation />
            <main className="max-w-7xl mx-auto px-4 py-6">
                {children}
            </main>
        </div>
    );
}
