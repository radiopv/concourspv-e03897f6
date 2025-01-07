import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../App";
import { useToast } from "@/hooks/use-toast";

export const useContestQueries = () => {
  const { toast } = useToast();

  const { data: contests, isLoading, error } = useQuery({
    queryKey: ['admin-contests-with-counts'],
    queryFn: async () => {
      console.log('Fetching contests with counts...');
      
      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          questions (count),
          participations (count)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching contests:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les concours",
          variant: "destructive",
        });
        throw error;
      }

      console.log('Fetched contests:', data);
      return data || [];
    }
  });

  return {
    contests,
    isLoading,
    error
  };
};