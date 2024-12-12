import { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { Outlet } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}