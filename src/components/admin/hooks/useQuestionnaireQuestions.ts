import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../App";
import { Question } from "@/types/question";

export const useQuestionnaireQuestions = (contestId: string) => {
  return useQuery({
    queryKey: ['questions', contestId],
    queryFn: async () => {
      console.log('Fetching questions for contest:', contestId);
      
      try {
        // First get or create the questionnaire
        const { data: existingQuestionnaire, error: questionnaireError } = await supabase
          .from('questionnaires')
          .select('id')
          .eq('contest_id', contestId)
          .maybeSingle();
        
        if (questionnaireError) {
          console.error('Error fetching questionnaire:', questionnaireError);
          throw questionnaireError;
        }

        let questionnaireId;
        
        if (!existingQuestionnaire) {
          console.log('No questionnaire found, creating one...');
          const { data: newQuestionnaire, error: createError } = await supabase
            .from('questionnaires')
            .insert([{
              contest_id: contestId,
              title: "Questionnaire du concours"
            }])
            .select('id')
            .single();
          
          if (createError) {
            console.error('Error creating questionnaire:', createError);
            throw createError;
          }
          
          questionnaireId = newQuestionnaire.id;
          console.log('Created new questionnaire with ID:', questionnaireId);
        } else {
          questionnaireId = existingQuestionnaire.id;
          console.log('Using existing questionnaire ID:', questionnaireId);
        }

        // Then get the questions
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select(`
            id,
            question_text,
            options,
            correct_answer,
            article_url,
            order_number
          `)
          .eq('questionnaire_id', questionnaireId)
          .order('order_number', { ascending: true });
        
        if (questionsError) {
          console.error('Error fetching questions:', questionsError);
          throw questionsError;
        }

        // Add default type to each question
        const questionsWithType = questionsData?.map(q => ({
          ...q,
          type: 'multiple_choice', // Default type
          questionnaire_id: questionnaireId
        })) || [];

        console.log('Fetched questions:', questionsWithType);
        return questionsWithType as Question[];
      } catch (error) {
        console.error('Error in question fetching process:', error);
        throw error;
      }
    },
    retry: 1
  });
};