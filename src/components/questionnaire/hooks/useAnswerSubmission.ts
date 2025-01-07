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
      state.setParticipationId(participantId);

      const isAnswerCorrect = state.selectedAnswer === currentQuestion.correct_answer;
      
      const { error: answerError } = await supabase
        .from('participant_answers')
        .insert([{
          participant_id: participantId,
          question_id: currentQuestion.id,
          answer: state.selectedAnswer
        }]);

      if (answerError) throw answerError;

      // Update participant score
      if (isAnswerCorrect) {
        const { error: scoreError } = await supabase
          .from('participants')
          .update({ 
            score: state.score + 1,
            points: (state.score + 1) * 10 // 10 points per correct answer
          })
          .eq('participation_id', participantId);

        if (scoreError) throw scoreError;
      }

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
        title: isAnswerCorrect ? "Bonne réponse ! 🎉" : "Pas tout à fait...",
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