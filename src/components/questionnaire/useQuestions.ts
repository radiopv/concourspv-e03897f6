import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useQuestions = (contestId: string) => {
  return useQuery({
    queryKey: ['questions', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('id, question_text, options, correct_answer, article_url, order_number, type, status')
        .eq('contest_id', contestId)
        .order('order_number');
      
      if (error) throw error;
      return data;
    }
  });
};