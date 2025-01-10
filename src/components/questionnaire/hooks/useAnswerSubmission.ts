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

      // Vérifier si cette question a déjà été répondue correctement dans une tentative précédente
      const { data: previousAnswers } = await supabase
        .from('participant_answers')
        .select('is_correct')
        .eq('participant_id', participationId)
        .eq('question_id', currentQuestion.id)
        .eq('is_correct', true)
        .lt('attempt_number', currentAttempt);

      const isFirstCorrectAnswer = !previousAnswers || previousAnswers.length === 0;

      // Insérer la nouvelle réponse
      const { error: insertError } = await supabase
        .from('participant_answers')
        .upsert({
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
        if (isFirstCorrectAnswer) {
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
            description: "Vous avez gagné un point pour cette nouvelle bonne réponse !",
          });
        } else {
          toast({
            title: "Bonne réponse ! ✨",
            description: "Vous aviez déjà répondu correctement à cette question.",
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