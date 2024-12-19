import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const useQuestionnaireCompletion = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const completeQuestionnaire = async (contestId: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      // Mettre à jour le statut du participant à 'completed'
      const { error: updateError } = await supabase
        .from('participants')
        .update({ status: 'completed' })
        .eq('contest_id', contestId)
        .eq('id', session.session.user.id);

      if (updateError) throw updateError;

      // Afficher le toast de succès
      toast({
        title: "Félicitations ! 🎉",
        description: "Questionnaire terminé avec succès !",
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
