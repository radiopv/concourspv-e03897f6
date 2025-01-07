import { Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../App';
import ContestList from './ContestList';
import ParticipantsList from './ParticipantsList';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import AdminDashboard from './AdminDashboard';
import GlobalSettings from './GlobalSettings';
import PrizeCatalogManager from './prize-catalog/PrizeCatalogManager';
import QuestionBank from '@/pages/QuestionBank';
import { EmailManager } from './EmailManager';
import AdminContestManager from './AdminContestManager';

const AdminRoutes = () => {
  const { toast } = useToast();

  const { data: isAdmin } = useQuery({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.user?.email === 'renaudcanuel@me.com';
    }
  });

  useEffect(() => {
    if (isAdmin === false) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les droits d'accès à cette section.",
        variant: "destructive",
      });
    }
  }, [isAdmin, toast]);

  if (isAdmin === undefined) {
    return <div>Chargement...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/contests" element={<ContestList />} />
      <Route path="/contests/:contestId/participants" element={<ParticipantsList />} />
      <Route path="/participants" element={<ParticipantsList />} />
      <Route path="/settings" element={<GlobalSettings />} />
      <Route path="/prizes" element={<PrizeCatalogManager />} />
      <Route path="/questions" element={<QuestionBank />} />
      <Route path="/emails" element={<EmailManager />} />
    </Routes>
  );
};

export default AdminRoutes;