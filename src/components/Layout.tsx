import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserNavBar from './navigation/UserNavBar';
import MobileNavBar from './navigation/MobileNavBar';
import { Toaster } from './ui/toaster';
import { useIsMobile } from '@/hooks/use-mobile';
import { Grid, Users, Settings, Database, Edit, Gift } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === 'admin';

  const adminLinks = [
    { icon: Grid, label: 'Dashboard', path: '/admin' },
    { icon: Edit, label: 'Concours', path: '/admin/contests' },
    { icon: Gift, label: 'Prix', path: '/admin/prizes' },
    { icon: Database, label: 'Questions', path: '/admin/questions' },
    { icon: Users, label: 'Utilisateurs', path: '/admin/users' },
    { icon: Settings, label: 'Paramètres', path: '/admin/settings' },
  ];

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <UserNavBar />
      
      {/* Menu d'administration */}
      {isAdmin && (
        <div className="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-50 border-b border-amber-100/20">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-4 overflow-x-auto py-4">
              {adminLinks.map((link) => (
                <Button
                  key={link.path}
                  variant={isAdminRoute && location.pathname === link.path ? "default" : "ghost"}
                  className="flex items-center gap-2 whitespace-nowrap hover:bg-amber-100 transition-colors"
                  onClick={() => navigate(link.path)}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className={`container mx-auto ${isMobile ? 'px-2 pb-20' : 'px-4'} py-8`}>
        {children}
      </main>
      {user && <MobileNavBar />}
      <Toaster />
    </div>
  );
};

export default Layout;