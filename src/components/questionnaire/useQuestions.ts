import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../App";
import { useToast } from "@/hooks/use-toast";

export const useQuestions = (contestId: string) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['questions', contestId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('questions')
          .select('id, question_text, options, correct_answer, article_url, order_number, type')
          .eq('contest_id', contestId)
          .order('order_number');
        
        if (error) {
          console.error('Error fetching questions:', error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les questions. Veuillez réessayer.",
            variant: "destructive",
          });
          throw error;
        }

        if (!data || data.length === 0) {
          toast({
            title: "Information",
            description: "Aucune question n'est disponible pour ce concours.",
          });
          return [];
        }

        return data;
      } catch (error) {
        console.error('Error in useQuestions:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors du chargement des questions.",
          variant: "destructive",
        });
        throw error;
      }
    },
    retry: 2,
    retryDelay: 1000,
  });
};