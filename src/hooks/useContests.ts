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

      // Récupérer tous les concours actifs
      const { data: contests, error: contestsError } = await supabase
        .from('contests')
        .select(`
          *,
          participants:participants(count),
          questions:questions(count)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (contestsError) {
        console.error('Error fetching contests:', contestsError);
        throw contestsError;
      }

      console.log('Fetched contests:', contests);

      const contestsWithCounts = contests?.map(contest => ({
        ...contest,
        participants: { count: contest.participants?.[0]?.count || 0 },
        questions: { count: contest.questions?.[0]?.count || 0 }
      })) || [];

      console.log('Contests with counts:', contestsWithCounts);
      return contestsWithCounts;
    },
    retry: 1,
    refetchOnWindowFocus: false,
    refetchInterval: 300000, // 5 minutes
    staleTime: 300000, // 5 minutes
  });
};