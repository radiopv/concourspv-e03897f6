
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Question } from '@/types/database';

export const useAnswerSubmission = (contestId: string) => {
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const submitAnswer = async (
    participationId: string,
    currentQuestion: Question,
    selectedAnswer: string,
    totalQuestions: number
  ) => {
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    console.log('Submitting answer:', {
      participationId,
      questionId: currentQuestion.id,
      answer: selectedAnswer,
      isCorrect
    });

    try {
      const { error: answerError } = await supabase
        .from('participant_answers')
        .insert({
          participant_id: participationId,
          contest_id: contestId,
          question_id: currentQuestion.id,
          answer: selectedAnswer,
          is_correct: isCorrect,
          attempt_number: 1
        });

      if (answerError) {
        console.error('Error submitting answer:', answerError);
        throw answerError;
      }

      if (isCorrect) {
        setCorrectAnswers(prev => prev + 1);
        
        // Ajouter les points pour une bonne réponse
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          await supabase
            .from('point_history')
            .insert([{
              user_id: session.user.id,
              points: 10,
              source: 'contest_answer',
              contest_id: contestId
            }]);
        }
      }

      return isCorrect;
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer votre réponse"
      });
      return false;
    }
  };

  const completeQuestionnaire = async (participationId: string, totalQuestions: number) => {
    const finalScore = Math.round((correctAnswers / totalQuestions) * 100);
    console.log('Completing questionnaire:', {
      participationId,
      finalScore,
      correctAnswers,
      totalQuestions
    });
    
    try {
      const { error: updateError } = await supabase
        .from('participants')
        .update({ 
          status: 'completed',
          score: finalScore,
          completed_at: new Date().toISOString()
        })
        .eq('participation_id', participationId);
      
      if (updateError) {
        console.error('Error updating participant status:', updateError);
        throw updateError;
      }
      
      // Ajouter un bonus de points pour avoir terminé le questionnaire
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        await supabase
          .from('point_history')
          .insert([{
            user_id: session.user.id,
            points: 50, // Bonus de complétion
            source: 'contest_completion',
            contest_id: contestId
          }]);
      }

      toast({
        title: "Félicitations !",
        description: "Questionnaire terminé avec succès !",
      });
      
      navigate(`/quiz-completion/${contestId}`);
    } catch (error) {
      console.error('Error updating participant status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour votre statut"
      });
    }
  };

  return {
    correctAnswers,
    submitAnswer,
    completeQuestionnaire
  };
};
