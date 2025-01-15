import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UserNavBar from './navigation/UserNavBar';
import MobileNavBar from './navigation/MobileNavBar';
import { Toaster } from './ui/toaster';
import { useIsMobile } from '@/hooks/use-mobile';
import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const Layout = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      console.log("Checking admin rights for user:", user.id);

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

      console.log("Member data received:", memberData);
      const isUserAdmin = memberData?.role === 'admin';
      console.log("Is user admin?", isUserAdmin);
      setIsAdmin(isUserAdmin);
    };

    checkAdminRole();
  }, [user, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {user && <MobileNavBar isAdmin={isAdmin} />}
      <UserNavBar isAdmin={isAdmin} />
      <main className={`container mx-auto ${isMobile ? 'px-2 pb-4 mt-14' : 'px-4'} py-8`}>
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
};

export default Layout;