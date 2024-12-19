import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useContestQueries = () => {
  const { data: contestsWithCounts, isLoading } = useQuery({
    queryKey: ['admin-contests-with-counts'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session?.access_token) {
        throw new Error("Not authenticated");
      }

      const { data: contests, error: contestsError } = await supabase
        .from('contests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (contestsError) throw contestsError;

      const contestsWithQuestionCounts = await Promise.all(contests.map(async (contest) => {
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

      return contestsWithQuestionCounts;
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 5000
  });

  return { contestsWithCounts, isLoading };
};
