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

      // Récupérer les informations du participant
      const { data: participant } = await supabase
        .from('participants')
        .select('participation_id, attempts')
        .eq('id', session.session.user.id)
        .eq('contest_id', contestId)
        .single();

      // Si le participant n'existe pas encore, on le crée
      const participationId = participant?.participation_id || 
        await ensureParticipantExists(session.session.user.id, contestId);

      // Vérifier si une réponse existe déjà pour cette question dans la tentative actuelle
      const { data: existingAnswer } = await supabase
        .from('participant_answers')
        .select('*')
        .eq('participant_id', participationId)
        .eq('question_id', currentQuestion.id)
        .single();

      const isAnswerCorrect = state.selectedAnswer === currentQuestion.correct_answer;

      if (existingAnswer) {
        console.log('Answer already exists for current attempt:', existingAnswer);
        // Mettre à jour le state sans insérer de nouvelle réponse
        state.setIsCorrect(isAnswerCorrect);
        state.setHasAnswered(true);
        state.setTotalAnswered(prev => prev + 1);
        if (isAnswerCorrect) {
          state.setScore(prev => prev + 1);
        }
        return;
      }

      // Mettre à jour le state
      state.setIsCorrect(isAnswerCorrect);
      state.setHasAnswered(true);
      state.setTotalAnswered(prev => prev + 1);
      if (isAnswerCorrect) {
        state.setScore(prev => prev + 1);
      }

      // Insérer la nouvelle réponse
      const { error: insertError } = await supabase
        .from('participant_answers')
        .insert([{
          participant_id: participationId,
          question_id: currentQuestion.id,
          answer: state.selectedAnswer,
          is_correct: isAnswerCorrect,
          attempt_number: participant?.attempts || 0
        }]);

      if (insertError) {
        console.error('Error submitting answer:', insertError);
        throw insertError;
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