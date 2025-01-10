import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import UserNavBar from '../navigation/UserNavBar';
import MobileNavBar from '../navigation/MobileNavBar';
import { Toaster } from '../ui/toaster';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

const Layout = ({ children, isAdmin = false }: LayoutProps) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <UserNavBar isAdmin={isAdmin} />
      <main className={`container mx-auto ${isMobile ? 'px-2 pb-20' : 'px-4'} py-8`}>
        {children}
      </main>
      {user && <MobileNavBar isAdmin={isAdmin} />}
      <Toaster />
    </div>
  );
};

export default Layout;