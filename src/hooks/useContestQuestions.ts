import { useQuery } from "@tanstack/react-query";
import { supabase } from "../integrations/supabase/client";

export const useContestQuestions = (contestId: string) => {
  return useQuery({
    queryKey: ['contest-questions', contestId],
    queryFn: async () => {
      if (!contestId) {
        console.log('No contest ID provided');
        return [];
      }

      // First get the questionnaire for this contest
      const { data: questionnaire, error: questionnaireError } = await supabase
        .from('questionnaires')
        .select('id')
        .eq('contest_id', contestId)
        .maybeSingle();

      if (questionnaireError) {
        console.error('Error fetching questionnaire:', questionnaireError);
        throw questionnaireError;
      }

      if (!questionnaire) {
        console.log('No questionnaire found for contest:', contestId);
        return [];
      }

      // Then get the questions for this questionnaire
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select(`
          id,
          question_text,
          options,
          correct_answer,
          article_url,
          type,
          order_number
        `)
        .eq('questionnaire_id', questionnaire.id)
        .order('order_number', { ascending: true });

      if (questionsError) {
        console.error('Error fetching questions:', questionsError);
        throw questionsError;
      }

      return questions || [];
    },
    enabled: !!contestId
  });
};