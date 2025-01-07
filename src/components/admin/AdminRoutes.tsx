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
import { useContestQueries } from './hooks/useContestQueries';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AdminRoutes = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { contestsWithCounts, isLoading: contestsLoading } = useContestQueries();
  const { user, isAdmin, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les droits d'accès à cette section.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isAdmin, authLoading, toast, navigate]);

  const handleSelectContest = (contestId: string) => {
    navigate(`/admin/contests/${contestId}`);
  };

  if (authLoading || contestsLoading) {
    return <div>Chargement...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route 
        path="/contests" 
        element={
          <ContestList 
            contests={contestsWithCounts || []} 
            onSelectContest={handleSelectContest}
          />
        } 
      />
      <Route path="/contests/new" element={<AdminContestManager />} />
      <Route path="/contests/:contestId" element={<AdminContestManager />} />
      <Route path="/contests/:contestId/participants" element={<ParticipantsList />} />
      <Route path="/participants" element={<ParticipantsList />} />
      <Route path="/settings" element={<GlobalSettings />} />
      <Route path="/prizes" element={<PrizeCatalogManager />} />
      <Route path="/questions" element={<QuestionBank />} />
      <Route path="/emails" element={<EmailManager />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRoutes;