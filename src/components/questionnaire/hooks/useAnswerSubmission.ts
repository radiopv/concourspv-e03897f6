import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Answer {
  questionId: string;
  answer: string;
}

interface UseAnswerSubmissionProps {
  contestId: string;
  participant: {
    id: string;
  };
}

export const useAnswerSubmission = ({ contestId, participant }: UseAnswerSubmissionProps) => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const addAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => {
      const existingAnswerIndex = prev.findIndex(a => a.questionId === questionId);
      if (existingAnswerIndex !== -1) {
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = { questionId, answer };
        return newAnswers;
      }
      return [...prev, { questionId, answer }];
    });
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex(prev => prev + 1);
  };

  const previousQuestion = () => {
    setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
  };

  const createParticipation = async () => {
    try {
      const { data: participation, error } = await supabase
        .from('participations')
        .insert({
          participant_id: participant.id,
          contest_id: contestId,
          attempts: 1,
          status: 'active'
        })
        .select('id, attempts')
        .single();
      
      if (error) throw error;
      return participation;
    } catch (error) {
      console.error('Error creating participation:', error);
      throw error;
    }
  };

  const submitAnswers = async () => {
    try {
      setIsSubmitting(true);

      // Create participation record
      const participation = await createParticipation();

      // Insert all answers
      const { error: answersError } = await supabase
        .from('participant_answers')
        .insert(
          answers.map(answer => ({
            participant_id: participant.id,
            question_id: answer.questionId,
            answer: answer.answer,
            participation_id: participation.id
          }))
        );

      if (answersError) throw answersError;

      // Calculate score
      const { data: questions } = await supabase
        .from('questions')
        .select('id, correct_answer')
        .in('id', answers.map(a => a.questionId));

      if (!questions) throw new Error('Could not fetch questions');

      const correctAnswers = answers.filter(answer => {
        const question = questions.find(q => q.id === answer.questionId);
        return question && answer.answer === question.correct_answer;
      });

      const score = Math.round((correctAnswers.length / questions.length) * 100);

      // Update participation with score
      const { error: updateError } = await supabase
        .from('participations')
        .update({
          score,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', participation.id);

      if (updateError) throw updateError;

      toast({
        title: "Réponses enregistrées",
        description: "Vos réponses ont été enregistrées avec succès.",
      });

      navigate(`/contests/${contestId}/results`);
    } catch (error) {
      console.error('Error submitting answers:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de vos réponses.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    answers,
    currentQuestionIndex,
    isSubmitting,
    addAnswer,
    nextQuestion,
    previousQuestion,
    submitAnswers
  };
};