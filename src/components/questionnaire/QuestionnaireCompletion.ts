
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const useQuestionnaireCompletion = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const completeQuestionnaire = async (contestId: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      console.log('Completing questionnaire for contest:', contestId);

      // Mettre à jour le statut du participant à 'completed'
      const { error: updateError } = await supabase
        .from('participants')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('contest_id', contestId)
        .eq('id', session.session.user.id);

      if (updateError) {
        console.error('Error updating participant status:', updateError);
        throw updateError;
      }

      // Ajouter les points de complétion
      const { error: pointsError } = await supabase
        .from('point_history')
        .insert([{
          user_id: session.session.user.id,
          points: 50,
          source: 'contest_completion',
          contest_id: contestId
        }]);

      if (pointsError) {
        console.error('Error adding completion points:', pointsError);
        throw pointsError;
      }

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
