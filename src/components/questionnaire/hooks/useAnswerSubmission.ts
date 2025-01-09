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

      const participantId = await ensureParticipantExists(session.session.user.id, contestId);

      // Vérifier si une réponse existe déjà pour cette question
      const { data: existingAnswer } = await supabase
        .from('participant_answers')
        .select('*')
        .eq('participant_id', participantId)
        .eq('question_id', currentQuestion.id)
        .single();

      if (existingAnswer) {
        console.log('Answer already exists:', existingAnswer);
        // Si une réponse existe déjà, on met à jour le state sans insérer
        const isAnswerCorrect = state.selectedAnswer === currentQuestion.correct_answer;
        state.setIsCorrect(isAnswerCorrect);
        state.setHasAnswered(true);
        state.setTotalAnswered(prev => prev + 1);
        if (isAnswerCorrect) {
          state.setScore(prev => prev + 1);
        }
        return;
      }

      const isAnswerCorrect = state.selectedAnswer === currentQuestion.correct_answer;
      state.setIsCorrect(isAnswerCorrect);
      state.setHasAnswered(true);
      state.setTotalAnswered(prev => prev + 1);
      if (isAnswerCorrect) {
        state.setScore(prev => prev + 1);
      }

      // Insérer la nouvelle réponse seulement si elle n'existe pas
      const { error } = await supabase
        .from('participant_answers')
        .insert([{
          participant_id: participantId,
          question_id: currentQuestion.id,
          answer: state.selectedAnswer,
          is_correct: isAnswerCorrect
        }]);

      if (error) {
        console.error('Error submitting answer:', error);
        throw error;
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