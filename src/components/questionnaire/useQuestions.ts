import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useQuestions = (contestId: string) => {
  return useQuery({
    queryKey: ['questions', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('contest_id', contestId);

      if (error) {
        throw new Error('Error fetching questions: ' + error.message);
      }

      return data;
    },
  });
};
