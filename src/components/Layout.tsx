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

  console.log("Current user:", user); // Debug log
  console.log("Current user role:", user?.role); // Debug log

  // Strict check for admin role
  const isAdmin = user?.role === 'admin';
  const isAdminRoute = location.pathname.startsWith('/admin');

  console.log("Is admin?", isAdmin); // Debug log
  console.log("Is admin route?", isAdminRoute); // Debug log

  const adminLinks = [
    { icon: Grid, label: 'Dashboard', path: '/admin' },
    { icon: Edit, label: 'Concours', path: '/admin/contests' },
    { icon: Gift, label: 'Prix', path: '/admin/prizes' },
    { icon: Database, label: 'Questions', path: '/admin/questions' },
    { icon: Users, label: 'Utilisateurs', path: '/admin/users' },
    { icon: Settings, label: 'Paramètres', path: '/admin/settings' },
  ];

  // If not admin and trying to access admin route, redirect to home
  React.useEffect(() => {
    if (!isAdmin && isAdminRoute) {
      console.log("Redirecting non-admin user from admin route"); // Debug log
      navigate('/');
    }
  }, [isAdmin, isAdminRoute, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <UserNavBar />
      
      {isAdmin && isAdminRoute && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-400 to-rose-500 text-white shadow-md sticky top-0 z-50 border-b border-amber-100/20">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-4 overflow-x-auto py-4">
              {adminLinks.map((link) => (
                <Button
                  key={link.path}
                  variant={location.pathname === link.path ? "secondary" : "ghost"}
                  className="flex items-center gap-2 whitespace-nowrap hover:bg-white/20 transition-colors text-white"
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