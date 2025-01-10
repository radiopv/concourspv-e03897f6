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

      const { data: participant } = await supabase
        .from('participants')
        .select('participation_id, attempts')
        .eq('id', session.session.user.id)
        .eq('contest_id', contestId)
        .single();

      const participationId = participant?.participation_id || 
        await ensureParticipantExists(session.session.user.id, contestId);

      const currentAttempt = participant?.attempts || 0;

      // Vérifier si une réponse existe déjà
      const { data: existingAnswers } = await supabase
        .from('participant_answers')
        .select('*')
        .eq('participant_id', participationId)
        .eq('question_id', currentQuestion.id)
        .eq('attempt_number', currentAttempt);

      const isAnswerCorrect = state.selectedAnswer === currentQuestion.correct_answer;

      if (existingAnswers && existingAnswers.length > 0) {
        // Si une réponse existe déjà, mettre à jour le state sans insérer
        console.log('Answer already exists for current attempt:', existingAnswers[0]);
        state.setIsCorrect(isAnswerCorrect);
        state.setHasAnswered(true);
        state.setTotalAnswered(prev => prev + 1);
        if (isAnswerCorrect) {
          state.setScore(prev => prev + 1);
        }
        return;
      }

      // Si aucune réponse n'existe, insérer la nouvelle réponse
      const { error: insertError } = await supabase
        .from('participant_answers')
        .upsert([{
          participant_id: participationId,
          question_id: currentQuestion.id,
          answer: state.selectedAnswer,
          is_correct: isAnswerCorrect,
          attempt_number: currentAttempt
        }], {
          onConflict: 'participant_id,question_id,attempt_number'
        });

      if (insertError) throw insertError;

      // Mettre à jour le state
      state.setIsCorrect(isAnswerCorrect);
      state.setHasAnswered(true);
      state.setTotalAnswered(prev => prev + 1);
      
      if (isAnswerCorrect) {
        state.setScore(prev => prev + 1);
        
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