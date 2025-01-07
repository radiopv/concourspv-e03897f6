import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../App";
import { useQuestionnaireState } from '../QuestionnaireState';
import { ensureParticipantExists } from '../ParticipantManager';
import { getRandomMessage } from '../messages';

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

      // First ensure the participant exists and get the participation_id
      console.log('Ensuring participant exists for user:', session.session.user.id);
      const participationId = await ensureParticipantExists(session.session.user.id, contestId);
      
      if (!participationId) {
        console.error('Failed to get participation ID');
        throw new Error("Failed to get participation ID");
      }

      console.log('Got participation ID:', participationId);

      // Now submit the answer using the participation_id
      const { error } = await supabase
        .from('participant_answers')
        .upsert({
          participant_id: participationId,
          question_id: currentQuestion.id,
          answer: state.selectedAnswer
        }, {
          onConflict: 'participant_id,question_id'
        });

      if (error) {
        console.error('Error submitting answer:', error);
        throw error;
      }

      // Update state and show success message
      const isAnswerCorrect = state.selectedAnswer === currentQuestion.correct_answer;
      state.setIsCorrect(isAnswerCorrect);
      state.setHasAnswered(true);
      state.setTotalAnswered(prev => prev + 1);
      if (isAnswerCorrect) {
        state.setScore(prev => prev + 1);
      }

      queryClient.invalidateQueries({ queryKey: ['contests'] });
      queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
      queryClient.invalidateQueries({ queryKey: ['participants', contestId] });

      const message = getRandomMessage();
      toast({
        title: "Réponse enregistrée",
        description: message,
        variant: "default",
      });

    } catch (error) {
      console.error('Error in handleSubmitAnswer:', error);
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