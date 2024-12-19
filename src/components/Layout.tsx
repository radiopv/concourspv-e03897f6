import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserNavBar from './navigation/UserNavBar';
import { Toaster } from './ui/toaster';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <UserNavBar />}
      <main className={`container mx-auto ${isMobile ? 'px-2' : 'px-4'} py-8`}>
        {children}
      </main>
      <Toaster />
    </div>
  );
};

export default Layout;