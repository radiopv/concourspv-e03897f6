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

      // Vérifier si le participant a déjà un score de 100%
      const { data: participant } = await supabase
        .from('participants')
        .select('participation_id, score, attempts')
        .eq('id', session.session.user.id)
        .eq('contest_id', contestId)
        .single();

      if (participant?.score === 100) {
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
      const { data: existingAnswer } = await supabase
        .from('participant_answers')
        .select('is_correct')
        .eq('participant_id', participationId)
        .eq('question_id', currentQuestion.id)
        .eq('is_correct', true)
        .single();

      const isAnswerCorrect = state.selectedAnswer === currentQuestion.correct_answer;

      // N'attribuer des points que si la réponse est correcte ET n'a pas déjà été correctement répondue
      if (isAnswerCorrect && !existingAnswer?.is_correct) {
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
          attempt_number: participant?.attempts || 0
        }]);

      if (insertError) throw insertError;

      // Mettre à jour le state
      state.setIsCorrect(isAnswerCorrect);
      state.setHasAnswered(true);
      state.setTotalAnswered(prev => prev + 1);
      
      if (isAnswerCorrect) {
        state.setScore(prev => prev + 1);
      } else {
        state.resetStreak();
      }

      await queryClient.invalidateQueries({ queryKey: ['contests'] });
      await queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
      await queryClient.invalidateQueries({ queryKey: ['participants', contestId] });
      await queryClient.invalidateQueries({ queryKey: ['user-points'] });

      const message = getRandomMessage();
      toast({
        title: "Réponse enregistrée",
        description: message,
        variant: "default",
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