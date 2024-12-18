import { useQuery } from "@tanstack/react-query";
import { supabase } from "../App";
import { useToast } from "@/hooks/use-toast";

export const useContests = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['active-contests'],
    queryFn: async () => {
      try {
        console.log("Fetching contests...");
        
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.access_token) {
          toast({
            variant: "destructive",
            title: "Non connecté",
            description: "Veuillez vous connecter pour voir les concours.",
          });
          throw new Error("Not authenticated");
        }

        const { data, error } = await supabase
          .from('contests')
          .select(`
            *,
            participants:participants(count),
            questions:questions(count)
          `)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching contests:', error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de charger les concours. Veuillez réessayer.",
          });
          throw error;
        }
        
        return data || [];
      } catch (error) {
        console.error('Error fetching contests:', error);
        throw error;
      }
    },
    retry: 1,
    refetchInterval: 5000
  });
};