import { supabase } from "@/App";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/use-notifications";

export const useQuestionnaireCompletion = (contestId: string) => {
  const { toast } = useToast();
  const { sendParticipationConfirmation } = useNotifications();

  const handleCompletion = async (score: number, participantEmail: string, contestTitle: string) => {
    try {
      const { error } = await supabase
        .from('participants')
        .update({ 
          status: 'completed',
          score: score,
          completed_at: new Date().toISOString()
        })
        .eq('contest_id', contestId);

      if (error) throw error;

      // Send participation confirmation email
      await sendParticipationConfirmation(participantEmail, contestTitle);

      toast({
        title: "Félicitations !",
        description: "Votre participation a été enregistrée avec succès.",
      });
    } catch (error) {
      console.error('Error completing questionnaire:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de votre participation.",
      });
    }
  };

  return {
    handleCompletion,
  };
};