import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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

      // Récupérer d'abord les concours
      const { data: contests, error: contestsError } = await supabase
        .from('contests')
        .select('*')
        .order('created_at', { ascending: false });

      if (contestsError) {
        console.error('Error fetching contests:', contestsError);
        throw contestsError;
      }

      // Pour chaque concours, compter les participants
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

      return contestsWithCounts || [];
    },
    retry: 1,
    refetchOnWindowFocus: false,
    refetchInterval: 300000, // 5 minutes
    staleTime: 300000, // 5 minutes
  });
};
