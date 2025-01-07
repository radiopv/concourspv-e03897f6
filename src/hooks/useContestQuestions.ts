import { useQuery } from "@tanstack/react-query";
import { supabase } from "../integrations/supabase/client";

export const useContestQuestions = (contestId: string) => {
  return useQuery({
    queryKey: ['contest-questions', contestId],
    queryFn: async () => {
      // First get the questionnaire
      const { data: questionnaire } = await supabase
        .from('questionnaires')
        .select('id')
        .eq('contest_id', contestId)
        .single();

      if (!questionnaire) return [];

      // Then get the questions
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('questionnaire_id', questionnaire.id);
      
      if (error) throw error;
      return data;
    }
  });
};