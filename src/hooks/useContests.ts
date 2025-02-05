import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useContests = () => {
  return useQuery({
    queryKey: ['contests'],
    queryFn: async () => {
      console.log('Starting to fetch contests...');
      
      // First check if we have a session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('Session check:', session ? 'Session exists' : 'No session', sessionError);
      
      if (!session) {
        console.log('No session found, continuing as public user');
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