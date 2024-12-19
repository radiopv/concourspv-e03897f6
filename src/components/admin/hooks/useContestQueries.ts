import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useContestQueries = () => {
  const { data: contestsWithCounts, isLoading } = useQuery({
    queryKey: ['admin-contests-with-counts'],
    queryFn: async () => {
      console.log("Fetching contests with counts...");
      
      const { data: contests, error: contestsError } = await supabase
        .from('contests')
        .select(`
          *,
          participants (count),
          prizes (
            prize_catalog (
              name,
              image_url,
              value,
              shop_url
            )
          )
        `)
        .order('created_at', { ascending: false });
      
      if (contestsError) {
        console.error("Error fetching contests:", contestsError);
        throw contestsError;
      }

      console.log("Fetched contests:", contests);

      const contestsWithQuestionCounts = await Promise.all(contests.map(async (contest) => {
        const { count: questionsCount } = await supabase
          .from('questions')
          .select('*', { count: 'exact', head: true })
          .eq('contest_id', contest.id);

        return {
          ...contest,
          questions: { count: questionsCount || 0 }
        };
      }));

      console.log("Processed contests with counts:", contestsWithQuestionCounts);
      return contestsWithQuestionCounts;
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 5000
  });

  return { contestsWithCounts, isLoading };
};