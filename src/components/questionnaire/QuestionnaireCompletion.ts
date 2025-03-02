
import { localData } from "@/lib/localData";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const useQuestionnaireCompletion = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const completeQuestionnaire = async (contestId: string) => {
    try {
      // Mock user ID for demonstration purposes
      const mockUserId = "user123";
      
      console.log('Completing questionnaire for contest:', contestId);

      // Get participant
      const participants = await localData.participants.getByContestId(contestId);
      const participant = participants.find(p => p.id === mockUserId);
      
      if (!participant) {
        throw new Error("Participant not found");
      }

      // Update participant status
      await localData.participants.update(participant.id, { 
        status: 'completed',
        completed_at: new Date().toISOString()
      });

      console.log('Participant status updated successfully');

      // Afficher le toast de succès
      toast({
        title: "Félicitations ! 🎉",
        description: "Questionnaire terminé avec succès ! +50 points bonus",
      });

      // Rediriger vers la liste des concours après un court délai
      setTimeout(() => {
        navigate('/contests');
      }, 2000);

      return true;
    } catch (error) {
      console.error('Error completing questionnaire:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la finalisation du questionnaire",
      });
      return false;
    }
  };

  return { completeQuestionnaire };
};
