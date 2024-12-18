import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../App";

export const useContestQueries = () => {
  const { data: contestsWithCounts, isLoading } = useQuery({
    queryKey: ['admin-contests-with-counts'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        throw new Error("Not authenticated");
      }

      const { data: contests, error: contestsError } = await supabase
        .from('contests')
        .select(`
          *,
          participants:participants(count),
          questions:questions(count)
        `)
        .order('created_at', { ascending: false });
      
      if (contestsError) throw contestsError;

      const contestsWithQuestionCounts = await Promise.all(contests.map(async (contest) => {
        const { count: questionsCount, error: questionsError } = await supabase
          .from('questions')
          .select('*', { count: 'exact', head: true })
          .eq('contest_id', contest.id);

        if (questionsError) throw questionsError;

        return {
          ...contest,
          questions: { count: questionsCount }
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