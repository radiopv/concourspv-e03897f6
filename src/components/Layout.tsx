import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserNavBar from './navigation/UserNavBar';
import MobileNavBar from './navigation/MobileNavBar';
import { Toaster } from './ui/toaster';
import { useIsMobile } from '@/hooks/use-mobile';
import { Grid, Users, Settings, Database, Edit, Gift, BookOpen, Trophy } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const Layout = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      console.log('Checking admin rights for:', user.email);

      const { data: memberData, error } = await supabase
        .from('members')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking admin role:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de vérifier vos droits d'administrateur",
        });
        setIsAdmin(false);
        return;
      }

      console.log('Member data:', memberData);
      const isUserAdmin = memberData?.role === 'admin';
      setIsAdmin(isUserAdmin);

      if (!isUserAdmin && location.pathname.startsWith('/admin')) {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Vous n'avez pas les droits d'administrateur",
        });
        navigate('/');
      }
    };

    checkAdminRole();
  }, [user, location.pathname, navigate, toast]);

  const isAdminRoute = location.pathname.startsWith('/admin');

  const adminLinks = [
    { icon: Grid, label: 'Dashboard', path: '/admin' },
    { icon: Edit, label: 'Concours', path: '/admin/contests' },
    { icon: BookOpen, label: 'Questions', path: '/admin/questions' },
    { icon: Gift, label: 'Prix', path: '/admin/prizes' },
    { icon: Trophy, label: 'Gagnants', path: '/admin/winners' },
    { icon: Users, label: 'Utilisateurs', path: '/admin/users' },
    { icon: Settings, label: 'Paramètres', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <UserNavBar isAdmin={isAdmin} />
      
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
        <Outlet />
      </main>
      {user && <MobileNavBar isAdmin={isAdmin} />}
      <Toaster />
    </div>
  );
};

export default Layout;