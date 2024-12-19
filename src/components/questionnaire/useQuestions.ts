import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useQuestions = (contestId: string | undefined) => {
  return useQuery({
    queryKey: ['questions', contestId],
    queryFn: async () => {
      if (!contestId) {
        throw new Error('Contest ID is required');
      }

      const { data, error } = await supabase
        .from('questions')
        .select('id, question_text, options, correct_answer, article_url, order_number, type')
        .eq('contest_id', contestId)
        .order('order_number');
      
      if (error) throw error;
      return data;
    },
    enabled: !!contestId, // Only run the query if contestId exists
  });
};