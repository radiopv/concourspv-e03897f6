import { Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../App';
import ContestList from './ContestList';
import ParticipantsList from './ParticipantsList';
import { PARTICIPANT_STATUS, ParticipantStatus } from '@/types/participant';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

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
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin
  });

  const { data: contestsWithWinners } = useQuery({
    queryKey: ['contests-with-winners'],
    queryFn: async () => {
      const { data: contestsData, error: contestsError } = await supabase
        .from('contests')
        .select(`
          id,
          title,
          description,
          is_new,
          has_big_prizes,
          status,
          participants (
            id,
            first_name,
            last_name,
            email,
            score,
            status,
            created_at,
            participant_prizes (
              prizes (
                prize_catalog (
                  id,
                  name,
                  value,
                  image_url
                )
              )
            )
          )
        `)
        .eq('participants.status', PARTICIPANT_STATUS.WINNER);

      if (contestsError) {
        console.error('Error fetching contests:', contestsError);
        throw contestsError;
      }

      return contestsData.map((contest: any) => ({
        id: contest.id,
        title: contest.title,
        description: contest.description,
        is_new: contest.is_new,
        has_big_prizes: contest.has_big_prizes,
        status: contest.status,
        participants: contest.participants?.map((p: any) => ({
          id: p.id,
          first_name: p.first_name,
          last_name: p.last_name,
          email: p.email,
          score: p.score,
          status: p.status as ParticipantStatus,
          created_at: p.created_at,
          participant_prizes: p.participant_prizes?.map((pp: any) => ({
            prize: {
              catalog_item: pp.prizes?.prize_catalog
            }
          })) || []
        }))
      }));
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
      <Route
        path="/"
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
