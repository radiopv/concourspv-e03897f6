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
    if (!state.selectedAnswer || !currentQuestion) return;

    state.setIsSubmitting(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour participer",
          variant: "destructive",
        });
        return;
      }

      // Récupérer les informations du participant
      const { data: participant } = await supabase
        .from('participants')
        .select('participation_id, attempts')
        .eq('id', session.session.user.id)
        .eq('contest_id', contestId)
        .single();

      const participationId = participant?.participation_id || 
        await ensureParticipantExists(session.session.user.id, contestId);

      const currentAttempt = participant?.attempts || 0;
      const isAnswerCorrect = state.selectedAnswer === currentQuestion.correct_answer;
      const isFirstAttempt = currentAttempt === 0;

      console.log('Submitting answer:', {
        participationId,
        questionId: currentQuestion.id,
        answer: state.selectedAnswer,
        isCorrect: isAnswerCorrect,
        attemptNumber: currentAttempt,
        isFirstAttempt
      });

      // Insérer la nouvelle réponse
      const { error: insertError } = await supabase
        .from('participant_answers')
        .insert({
          participant_id: participationId,
          question_id: currentQuestion.id,
          answer: state.selectedAnswer,
          is_correct: isAnswerCorrect,
          attempt_number: currentAttempt
        });

      if (insertError) {
        console.error('Erreur lors de l\'insertion de la réponse:', insertError);
        throw insertError;
      }

      // Mettre à jour le state
      state.setIsCorrect(isAnswerCorrect);
      state.setHasAnswered(true);
      state.setTotalAnswered(prev => prev + 1);
      
      if (isAnswerCorrect) {
        // N'attribuer des points que lors de la première tentative
        if (isFirstAttempt) {
          state.setScore(prev => prev + 1);
          state.incrementStreak();
          const currentStreak = state.getCurrentStreak();
          
          await awardPoints(
            session.session.user.id,
            1,
            contestId,
            currentStreak
          );

          toast({
            title: "Bravo ! 🎉",
            description: "Vous avez gagné un point pour cette bonne réponse !",
          });
        } else {
          toast({
            title: "Bonne réponse ! ✨",
            description: "Pas de points pour les tentatives suivantes, mais continuez comme ça !",
          });
        }
      } else {
        state.resetStreak();
        toast({
          title: "Pas tout à fait... 😕",
          description: "La réponse n'est pas correcte. Essayez encore !",
          variant: "destructive",
        });
      }

      await queryClient.invalidateQueries({ queryKey: ['contests'] });
      await queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
      await queryClient.invalidateQueries({ queryKey: ['participants', contestId] });
      await queryClient.invalidateQueries({ queryKey: ['user-points'] });

      const message = getRandomMessage();
      toast({
        description: message,
      });

    } catch (error) {
      console.error('Erreur lors de la soumission de la réponse:', error);
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