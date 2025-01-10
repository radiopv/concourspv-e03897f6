import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useQuestionnaireState } from '../QuestionnaireState';
import { ensureParticipantExists } from '../ParticipantManager';
import { getRandomMessage } from '../messages';
import { awardPoints } from '../../../services/pointsService';

export const useAnswerSubmission = (contestId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const state = useQuestionnaireState();

  const handleSubmitAnswer = async (currentQuestion: any) => {
    console.log('handleSubmitAnswer called with state:', {
      selectedAnswer: state.selectedAnswer,
      hasAnswered: state.hasAnswered,
      isSubmitting: state.isSubmitting
    });

    if (!state.selectedAnswer || !currentQuestion) {
      console.log('No answer selected or no current question');
      return;
    }

    if (state.hasAnswered) {
      console.log('Answer already submitted, preventing duplicate submission');
      return;
    }

    console.log('Starting answer submission process');
    state.setIsSubmitting(true);

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        console.log('No authenticated user found');
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour participer",
          variant: "destructive",
        });
        return;
      }

      // Vérifier si le participant a déjà un score de 100%
      const { data: participant } = await supabase
        .from('participants')
        .select('participation_id, score, attempts')
        .eq('id', session.session.user.id)
        .eq('contest_id', contestId)
        .single();

      console.log('Participant data:', participant);

      if (participant?.score === 100) {
        console.log('Participant already has perfect score');
        toast({
          title: "Participation impossible",
          description: "Vous avez déjà obtenu un score parfait de 100% !",
          variant: "destructive",
        });
        return;
      }

      const participationId = participant?.participation_id || 
        await ensureParticipantExists(session.session.user.id, contestId);

      // Vérifier si la question a déjà été répondue correctement
      const { data: existingAnswers, error: answersError } = await supabase
        .from('participant_answers')
        .select('*')
        .eq('participant_id', participationId)
        .eq('question_id', currentQuestion.id)
        .maybeSingle();

      if (answersError) {
        console.error('Error checking existing answers:', answersError);
        throw answersError;
      }

      console.log('Existing answers:', existingAnswers);

      const currentAttempt = participant?.attempts || 0;
      const isAnswerCorrect = state.selectedAnswer.trim() === currentQuestion.correct_answer.trim();

      console.log('Answer validation:', {
        isCorrect: isAnswerCorrect,
        selectedAnswer: state.selectedAnswer.trim(),
        correctAnswer: currentQuestion.correct_answer.trim()
      });

      // N'attribuer des points que si la réponse est correcte ET n'a pas déjà été correctement répondue
      if (isAnswerCorrect && !existingAnswers?.is_correct) {
        const currentStreak = state.getCurrentStreak();
        let pointsToAward = 1;

        if (currentStreak > 0 && currentStreak % 10 === 0) {
          pointsToAward += 5;
        }

        await awardPoints(
          session.session.user.id,
          pointsToAward,
          contestId,
          currentStreak
        );
      }

      // Enregistrer la nouvelle réponse
      const { error: insertError } = await supabase
        .from('participant_answers')
        .insert([{
          participant_id: participationId,
          question_id: currentQuestion.id,
          answer: state.selectedAnswer,
          is_correct: isAnswerCorrect,
          attempt_number: currentAttempt
        }]);

      if (insertError) {
        console.error('Error inserting answer:', insertError);
        throw insertError;
      }

      // Mettre à jour le state
      state.setIsCorrect(isAnswerCorrect);
      state.setHasAnswered(true);
      state.setTotalAnswered(prev => prev + 1);
      
      if (isAnswerCorrect) {
        state.setScore(prev => prev + 1);
        state.incrementStreak();
        console.log('Streak incremented');
      } else {
        state.resetStreak();
        console.log('Streak reset');
      }

      await queryClient.invalidateQueries({ queryKey: ['contests'] });
      await queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
      await queryClient.invalidateQueries({ queryKey: ['participants', contestId] });
      await queryClient.invalidateQueries({ queryKey: ['user-points'] });

      const message = getRandomMessage();
      toast({
        title: isAnswerCorrect ? "Bonne réponse !" : "Mauvaise réponse",
        description: message,
        variant: isAnswerCorrect ? "default" : "destructive",
      });

    } catch (error) {
      console.error('Error submitting answer:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission de votre réponse",
        variant: "destructive",
      });
    } finally {
      state.setIsSubmitting(false);
    }
  };

  return { handleSubmitAnswer };
};