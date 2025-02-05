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

    if (isCorrect) {
      state.setTotalAnswered(prev => prev + 1);
      
      try {
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

          await supabase
            .from('user_points')
            .upsert([{
              user_id: session.user.id,
              total_points: state.totalAnswered * 10,
              current_streak: state.totalAnswered + 1,
              best_streak: Math.max(state.totalAnswered + 1, state.totalAnswered)
            }]);
        }
      } catch (error) {
        console.error('Error awarding points:', error);
      }
    }

    const newScore = Math.round((state.totalAnswered / questions.length) * 100);
    state.setScore(newScore);

    if (state.currentQuestionIndex < questions.length - 1) {
      state.setCurrentQuestionIndex(prev => prev + 1);
      state.setSelectedAnswer('');
      state.setHasAnswered(false);
      state.setHasClickedLink(false);
    } else {
      await handleQuizCompletion(newScore);
    }
  };

  const handleQuizCompletion = async (finalScore: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour terminer le quiz",
          variant: "destructive"
        });
        return;
      }

      console.log('Completing quiz with score:', finalScore);
      console.log('Participant data:', participant);

      const { error: updateError } = await supabase
        .from('participants')
        .update({ 
          score: finalScore,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('contest_id', contestId)
        .eq('id', session.user.id)
        .eq('participation_id', participant.participation_id);

      if (updateError) {
        console.error('Error updating participant:', updateError);
        throw updateError;
      }

      if (participant?.participation_id) {
        const answersToSave = questions.map((question, index) => ({
          participant_id: participant.participation_id,
          question_id: question.id,
          answer: state.selectedAnswer,
          is_correct: state.selectedAnswer === question.correct_answer,
          attempt_number: participant.attempts || 1
        }));

        const { error: answersError } = await supabase
          .from('participant_answers')
          .insert(answersToSave);

        if (answersError) {
          console.error('Error saving answers:', answersError);
        }
      }

      navigate(`/quiz-completion/${contestId}`, {
        state: {
          score: finalScore,
          totalQuestions: questions.length,
          contestId,
          requiredPercentage: settings?.required_percentage || 90
        }
      });

    } catch (error) {
      console.error('Error completing quiz:', error);
      toast({
        title: "Erreur",
        description: "Impossible de terminer le quiz",
        variant: "destructive"
      });
    }
  };

  return { handleNextQuestion };
};