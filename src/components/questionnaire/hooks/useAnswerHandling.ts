
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useQuestionnaireState } from '../QuestionnaireState';

export const useAnswerHandling = (
  contestId: string,
  participant: any,
  questions: any[],
  settings: any
) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const state = useQuestionnaireState();

  const handleNextQuestion = async () => {
    if (!state.selectedAnswer) {
      toast({
        title: "Attention",
        description: "Veuillez sélectionner une réponse avant de continuer",
        variant: "destructive"
      });
      return;
    }

    if (!questions || !questions.length) {
      console.error('No questions available');
      return;
    }

    state.setIsSubmitting(true);
    const currentQuestion = questions[state.currentQuestionIndex];
    const isCorrect = currentQuestion?.correct_answer === state.selectedAnswer;

    try {
      console.log('Saving answer:', {
        participationId: participant?.participation_id,
        questionId: currentQuestion.id,
        answer: state.selectedAnswer,
        isCorrect,
        attemptNumber: participant.attempts || 1
      });

      // Vérifier si une réponse existe déjà pour cette question et cette tentative
      const { data: existingAnswer } = await supabase
        .from('participant_answers')
        .select('id')
        .eq('participant_id', participant?.participation_id)
        .eq('question_id', currentQuestion.id)
        .eq('attempt_number', participant.attempts || 1)
        .maybeSingle();

      if (existingAnswer) {
        console.log('Answer already exists for this question and attempt');
        return;
      }

      // Sauvegarder la réponse
      const { error: answerError } = await supabase
        .from('participant_answers')
        .insert([{
          participant_id: participant?.participation_id,
          question_id: currentQuestion.id,
          contest_id: contestId,
          answer: state.selectedAnswer,
          is_correct: isCorrect,
          attempt_number: participant.attempts || 1,
          answered_at: new Date().toISOString()
        }]);

      if (answerError) {
        console.error('Error saving answer:', answerError);
        throw answerError;
      }

      state.setIsCorrect(isCorrect);
      state.setHasAnswered(true);

      if (isCorrect) {
        state.incrementStreak();
        state.setTotalAnswered(prev => prev + 1);
        
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          await supabase
            .from('point_history')
            .insert([{
              user_id: session.user.id,
              points: 10,
              source: 'contest_answer',
              contest_id: contestId,
              streak: state.getCurrentStreak()
            }]);
        }
      } else {
        state.resetStreak();
      }

      // Attendre un moment pour montrer le résultat
      setTimeout(() => {
        if (state.currentQuestionIndex < questions.length - 1) {
          state.setCurrentQuestionIndex(prev => prev + 1);
          state.setSelectedAnswer('');
          state.setHasAnswered(false);
          state.setHasClickedLink(false);
          state.setIsCorrect(null);
        } else {
          // Questionnaire terminé
          navigate(`/quiz-completion/${contestId}`);
        }
        state.setIsSubmitting(false);
      }, 2000);

    } catch (error) {
      console.error('Error handling answer:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de votre réponse",
        variant: "destructive"
      });
      state.setIsSubmitting(false);
    }
  };

  return { handleNextQuestion };
};
