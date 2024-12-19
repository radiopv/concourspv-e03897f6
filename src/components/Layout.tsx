import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserNavBar from './navigation/UserNavBar';
import { Toaster } from './ui/toaster';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <UserNavBar />}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <Toaster />
    </div>
  );
};

export default Layout;