import { useState } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "../../../App";
import { QuestionBankItem } from '@/types/question';

export const useQuestionBankActions = (contestId: string) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleAddFromBank = async (bankQuestions: QuestionBankItem[]) => {
    try {
      let questionnaireId;
      const { data: existingQuestionnaire, error: questionnaireError } = await supabase
        .from('questionnaires')
        .select('id')
        .eq('contest_id', contestId)
        .maybeSingle();
      
      if (questionnaireError) {
        const { data: newQuestionnaire, error: createError } = await supabase
          .from('questionnaires')
          .insert([{
            contest_id: contestId,
            title: "Questionnaire du concours",
          }])
          .select()
          .single();
        
        if (createError) throw createError;
        questionnaireId = newQuestionnaire.id;
      } else {
        questionnaireId = existingQuestionnaire?.id;
      }

      // Get the last order number, handling the case where no questions exist
      const { data: lastQuestionData } = await supabase
        .from('questions')
        .select('order_number')
        .eq('questionnaire_id', questionnaireId)
        .order('order_number', { ascending: false })
        .limit(1)
        .maybeSingle();

      const startOrderNumber = (lastQuestionData?.order_number || 0) + 1;

      const questionsToAdd = bankQuestions.map((q, index) => ({
        questionnaire_id: questionnaireId,
        question_text: q.question_text,
        options: q.options,
        correct_answer: q.correct_answer,
        article_url: q.article_url,
        order_number: startOrderNumber + index
      }));

      const { error } = await supabase
        .from('questions')
        .insert(questionsToAdd);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
      toast({
        title: "Succès",
        description: `${bankQuestions.length} questions ont été ajoutées`,
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error adding questions from bank:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter les questions",
        variant: "destructive",
      });
    }
  };

  return {
    isOpen,
    setIsOpen,
    handleAddFromBank
  };
};