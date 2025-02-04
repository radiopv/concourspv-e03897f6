import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const useContests = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['contests'],
    queryFn: async () => {
      console.log('Starting to fetch contests...');
      
      // First check if we have a session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('Session check:', session ? 'Session exists' : 'No session', sessionError);
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Failed to check authentication status');
      }

      console.log('Attempting to fetch contests from Supabase...');
      const { data: contests, error } = await supabase
        .from('contests')
        .select(`
          *,
          prizes (
            id,
            catalog_item:prize_catalog(*)
          )
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

      if (!contests) {
        console.log('No contests found in database');
        return [];
      }

      console.log('Successfully fetched contests:', contests);
      return contests;
    },
    retry: 1,
    refetchOnWindowFocus: false,
    gcTime: 1000 * 60 * 30, // Keep data in cache for 30 minutes
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });
};