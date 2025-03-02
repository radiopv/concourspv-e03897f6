
import { useQuery } from "@tanstack/react-query";
import { localData } from "@/lib/localData";

export const useContestQueries = () => {
  const { data: contestsWithCounts, isLoading } = useQuery({
    queryKey: ['admin-contests-with-counts'],
    queryFn: async () => {
      try {
        // For this simplified version, we can just use our getActive method
        // In a real app, you might want separate methods for admin vs user views
        const contests = await localData.contests.getActive();
        
        if (!contests) {
          return [];
        }
        
        // Add participant and question counts
        const contestsWithQuestionCounts = await Promise.all(contests.map(async (contest) => {
          const participants = await localData.participants.getByContestId(contest.id);
          const questions = await localData.questions.getByContestId(contest.id);
          
          return {
            ...contest,
            participants: { count: participants.length },
            questions: { count: questions.length }
          };
        }));
        
        return contestsWithQuestionCounts;
      } catch (error) {
        console.error("Error fetching contests with counts:", error);
        throw error;
      }
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 5000
  });

  return { contestsWithCounts, isLoading };
};
