import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../App";
import { useQuestionnaireState } from '../QuestionnaireState';
import { ParticipantManager } from '../ParticipantManager';
import { getRandomMessage } from '../messages';

export const useAnswerSubmission = (contestId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const state = useQuestionnaireState();

  const handleSubmitAnswer = async (currentQuestion: any) => {
    if (!state.selectedAnswer || !currentQuestion) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une réponse",
        variant: "destructive",
      });
      return;
    }

    state.setIsSubmitting(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id || !session.session.user.email) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour participer",
          variant: "destructive",
        });
        return;
      }

      // First ensure the participant exists and get the participation_id
      console.log('Getting participation ID for user:', session.session.user.id);
      const participationId = await ParticipantManager.ensureParticipantExists(
        session.session.user.id, 
        contestId,
        session.session.user.email
      );
      
      if (!participationId) {
        console.error('Failed to get participation ID');
        throw new Error("Failed to get participation ID");
      }

      console.log('Submitting answer with participation ID:', participationId);

      // Now submit the answer using the participation_id
      const { error: submitError } = await supabase
        .from('participant_answers')
        .upsert({
          participant_id: participationId,
          question_id: currentQuestion.id,
          answer: state.selectedAnswer
        }, {
          onConflict: 'participant_id,question_id'
        });

      if (submitError) {
        console.error('Error submitting answer:', submitError);
        throw submitError;
      }

      // Update state and show success message
      const isAnswerCorrect = state.selectedAnswer === currentQuestion.correct_answer;
      state.setIsCorrect(isAnswerCorrect);
      state.setHasAnswered(true);
      state.setTotalAnswered(prev => prev + 1);
      if (isAnswerCorrect) {
        state.setScore(prev => prev + 1);
      }

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['contests'] });
      queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
      queryClient.invalidateQueries({ queryKey: ['participants', contestId] });

      const message = getRandomMessage();
      toast({
        title: "Réponse enregistrée",
        description: message,
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