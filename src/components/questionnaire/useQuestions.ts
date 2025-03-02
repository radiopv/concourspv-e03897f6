
import { useQuery } from "@tanstack/react-query";
import { localData } from "@/lib/localData";

export const useQuestions = (contestId: string) => {
  return useQuery({
    queryKey: ['questions', contestId],
    queryFn: async () => {
      try {
        const questions = await localData.questions.getByContestId(contestId);
        return questions.sort((a, b) => a.order_number - b.order_number);
      } catch (error) {
        console.error("Error fetching questions:", error);
        throw error;
      }
    },
    enabled: !!contestId
  });
};
