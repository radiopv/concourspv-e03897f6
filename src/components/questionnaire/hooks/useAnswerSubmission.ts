import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../App";
import { useQuestionnaireState } from '../QuestionnaireState';
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

      // Get or create participant
      let { data: participant } = await supabase
        .from('participants')
        .select('id')
        .eq('email', session.session.user.email)
        .single();

      if (!participant) {
        const { data: newParticipant } = await supabase
          .from('participants')
          .insert({
            email: session.session.user.email,
            first_name: session.session.user.email.split('@')[0],
            last_name: 'Participant'
          })
          .select('id')
          .single();
        
        participant = newParticipant;
      }

      if (!participant) {
        throw new Error("Failed to get or create participant");
      }

      // Get current participation or create new one
      let { data: participation } = await supabase
        .from('participations')
        .select('id, attempts')
        .eq('participant_id', participant.id)
        .eq('contest_id', contestId)
        .order('attempts', { ascending: false })
        .limit(1)
        .single();

      if (!participation) {
        const { data: newParticipation } = await supabase
          .from('participations')
          .insert({
            participant_id: participant.id,
            contest_id: contestId,
            attempts: 1,
            status: 'active'
          })
          .select('id, attempts')
          .single();
        
        participation = newParticipation;
      }

      if (!participation) {
        throw new Error("Failed to get or create participation");
      }

      // Submit the answer
      const { error: submitError } = await supabase
        .from('participant_answers')
        .insert({
          participant_id: participation.id,
          question_id: currentQuestion.id,
          answer: state.selectedAnswer
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