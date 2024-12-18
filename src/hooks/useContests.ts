import { useQuery } from "@tanstack/react-query";
import { supabase } from "../App";
import { useToast } from "@/hooks/use-toast";

export const useContests = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['active-contests'],
    queryFn: async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        
        if (!session?.session?.user) {
          toast({
            variant: "destructive",
            title: "Non connecté",
            description: "Veuillez vous connecter pour voir les concours.",
          });
          throw new Error("Not authenticated");
        }

        const { data: contests, error } = await supabase
          .from('contests')
          .select(`
            *,
            participants:participants(count),
            questions:questions(count)
          `)
          .order('created_at', { ascending: false })
          .throwOnError();

        if (error) {
          console.error('Error fetching contests:', error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de charger les concours. Veuillez réessayer.",
          });
          throw error;
        }

        return contests || [];
      } catch (error) {
        console.error('Error in useContests:', error);
        throw error;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: 30000 // Reduced from 5000 to prevent too frequent requests
  });
};