import { Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../App';
import ContestList from './ContestList';
import ParticipantsList from './ParticipantsList';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import AdminDashboard from './AdminDashboard';

const AdminRoutes = () => {
  const [selectedContestId, setSelectedContestId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: isAdmin } = useQuery({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.user?.email === 'renaudcanuel@me.com';
    }
  });

  const { data: contests } = useQuery({
    queryKey: ['admin-contests'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          questionnaires (
            id,
            title,
            questions (
              id,
              question_text
            )
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin
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
      <Route
        path="/contests"
        element={
          <ContestList
            contests={contests || []}
            onSelectContest={setSelectedContestId}
          />
        }
      />
      <Route
        path="/participants/:contestId"
        element={<ParticipantsList />}
      />
    </Routes>
  );
};

export default AdminRoutes;