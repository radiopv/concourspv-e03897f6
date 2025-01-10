import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export const useContests = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  return useQuery({
    queryKey: ['active-contests'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Non connecté",
          description: "Veuillez vous connecter pour voir les concours.",
        });
        navigate('/login');
        return [];
      }

      console.log('Fetching contests for user:', session.user.id);

      // Get all active contests without filtering winners
      const { data: contests, error: contestsError } = await supabase
        .from('contests')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (contestsError) {
        console.error('Error fetching contests:', contestsError);
        throw contestsError;
      }

      console.log('Fetched contests:', contests);

      // For each contest, count participants
      const contestsWithCounts = await Promise.all(contests.map(async (contest) => {
        const { count: participantsCount } = await supabase
          .from('participants')
          .select('*', { count: 'exact', head: true })
          .eq('contest_id', contest.id);

        const { count: questionsCount } = await supabase
          .from('questions')
          .select('*', { count: 'exact', head: true })
          .eq('contest_id', contest.id);

        return {
          ...contest,
          participants: { count: participantsCount || 0 },
          questions: { count: questionsCount || 0 }
        };
      }));

      console.log('Contests with counts:', contestsWithCounts);
      return contestsWithCounts || [];
    },
    retry: 1,
    refetchOnWindowFocus: false,
    refetchInterval: 300000, // 5 minutes
    staleTime: 300000, // 5 minutes
  });
};