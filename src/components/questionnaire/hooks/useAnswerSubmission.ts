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

      if (answerError) throw answerError;

      if (isCorrect) {
        setCorrectAnswers(prev => prev + 1);
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
    
    try {
      const { error: updateError } = await supabase
        .from('participants')
        .update({ 
          status: 'completed',
          score: finalScore,
          completed_at: new Date().toISOString()
        })
        .eq('participation_id', participationId);
      
      if (updateError) throw updateError;
      
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