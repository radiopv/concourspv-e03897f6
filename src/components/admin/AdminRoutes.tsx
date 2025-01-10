import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import AdminContestManager from './AdminContestManager';
import ContentValidator from './ContentValidator';
import GlobalSettings from './GlobalSettings';
import EditQuestionsList from './EditQuestionsList';
import UserManager from './users/UserManager';
import PrizeCatalogManager from './prize-catalog/PrizeCatalogManager';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const AdminRoutes = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  React.useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) return;

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
          description: "Impossible de vérifier vos droits d'administrateur.",
        });
        navigate('/');
        return;
      }

      if (!memberData || memberData.role !== 'admin') {
        console.log('User is not admin:', memberData);
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Vous n'avez pas les droits d'administrateur.",
        });
        navigate('/');
      }
    };

    checkAdminRole();
  }, [user, navigate, toast]);

  if (!user) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Accès non autorisé</h2>
        <p className="mb-4">Vous devez être connecté pour accéder à cette section.</p>
        <button onClick={() => navigate('/login')} className="btn-primary">
          Se connecter
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/contests/*" element={<AdminContestManager />} />
        <Route path="/prizes" element={<PrizeCatalogManager contestId={null} />} />
        <Route path="/questions" element={<EditQuestionsList contestId={null} />} />
        <Route path="/users" element={<UserManager />} />
        <Route path="/settings" element={<GlobalSettings />} />
        <Route path="/content" element={<ContentValidator />} />
      </Routes>
    </div>
  );
};

export default AdminRoutes;