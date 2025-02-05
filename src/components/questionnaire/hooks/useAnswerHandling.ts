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

    const currentQuestion = questions[state.currentQuestionIndex];
    const isCorrect = currentQuestion?.correct_answer === state.selectedAnswer;

    try {
      // Sauvegarder la réponse
      const { error: answerError } = await supabase
        .from('participant_answers')
        .insert([{
          participant_id: participant?.participation_id,
          question_id: currentQuestion.id,
          contest_id: contestId,
          answer: state.selectedAnswer,
          is_correct: isCorrect,
          attempt_number: participant.attempts || 1
        }]);

      if (answerError) throw answerError;

      if (isCorrect) {
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
              streak: state.totalAnswered + 1
            }]);
        }
      }

      if (state.currentQuestionIndex < questions.length - 1) {
        state.setCurrentQuestionIndex(prev => prev + 1);
        state.setSelectedAnswer('');
        state.setHasAnswered(false);
        state.setHasClickedLink(false);
      } else {
        navigate(`/quiz-completion/${contestId}`);
      }
    } catch (error) {
      console.error('Error handling answer:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de votre réponse",
        variant: "destructive"
      });
    }
  };

  return { handleNextQuestion };
};