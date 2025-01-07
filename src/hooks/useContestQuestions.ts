import { useQuery } from "@tanstack/react-query";
import { supabase } from "../integrations/supabase/client";

export const useContestQuestions = (contestId: string) => {
  return useQuery({
    queryKey: ['contest-questions', contestId],
    queryFn: async () => {
      // First get the questionnaire
      const { data: questionnaire, error: questionnaireError } = await supabase
        .from('questionnaires')
        .select('id')
        .eq('contest_id', contestId)
        .maybeSingle();

      if (questionnaireError) {
        console.error('Error fetching questionnaire:', questionnaireError);
        return [];
      }

      if (!questionnaire) {
        console.log('No questionnaire found for contest:', contestId);
        return [];
      }

      // Then get the questions
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('questionnaire_id', questionnaire.id);
      
      if (error) {
        console.error('Error fetching questions:', error);
        throw error;
      }
      
      return data;
    }
  });
};