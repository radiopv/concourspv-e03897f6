import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UserNavBar from './navigation/UserNavBar';
import MobileNavBar from './navigation/MobileNavBar';
import { Toaster } from './ui/toaster';
import { useIsMobile } from '@/hooks/use-mobile';
import { Grid, Users, Settings, Database, Edit, Gift, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate, useLocation, Outlet, Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

const Layout = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Vérification du rôle admin avec React Query
  const { data: isAdmin = false, isLoading: isCheckingAdmin } = useQuery({
    queryKey: ['admin-check', user?.id],
    queryFn: async () => {
      if (!user) return false;

      console.log("Checking admin rights for user:", user.email);

      // Vérification directe pour l'email spécifique
      if (user.email === 'renaudcanuel@me.com') {
        console.log("Admin email match found");
        return true;
      }

      // Vérification dans la table members comme backup
      const { data: memberData, error } = await supabase
        .from('members')
        .select('role')
        .eq('email', user.email)
        .single();

      if (error) {
        console.error('Error checking admin role:', error);
        return false;
      }

      const isUserAdmin = memberData?.role === 'admin';
      console.log("Is user admin?", isUserAdmin);
      return isUserAdmin;
    },
    enabled: !!user,
  });

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  // Redirection logic
  React.useEffect(() => {
    if (!user && !isAuthRoute) {
      navigate('/login');
    } else if (user && isAuthRoute) {
      navigate(isAdmin ? '/admin' : '/dashboard');
    } else if (isAdminRoute && !isAdmin && user) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les droits d'accès à l'administration.",
      });
      navigate('/dashboard');
    }
  }, [user, isAdmin, isAdminRoute, isAuthRoute, navigate, toast]);

  const adminLinks = [
    { icon: Grid, label: 'Dashboard', path: '/admin' },
    { icon: Edit, label: 'Concours', path: '/admin/contests' },
    { icon: BookOpen, label: 'Questions', path: '/admin/questions' },
    { icon: Gift, label: 'Prix', path: '/admin/prizes' },
    { icon: Users, label: 'Utilisateurs', path: '/admin/users' },
    { icon: Settings, label: 'Paramètres', path: '/admin/settings' },
  ];

  // Si on vérifie encore les droits admin, afficher un loader
  if (isCheckingAdmin) {
    return <div>Vérification des droits d'accès...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {user && <MobileNavBar isAdmin={isAdmin} />}
      <UserNavBar isAdmin={isAdmin} />
      
      {isAdmin && isAdminRoute && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-400 to-rose-500 text-white shadow-md sticky top-14 z-40 border-b border-amber-100/20">
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

      <main className={`container mx-auto ${isMobile ? 'px-2 pb-4 mt-14' : 'px-4'} py-8`}>
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
};

export default Layout;