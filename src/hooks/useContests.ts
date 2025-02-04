import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useContests = () => {
  return useQuery({
    queryKey: ['contests'],
    queryFn: async () => {
      console.log('Fetching contests...');
      
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

      console.log('Raw contests data:', contests);

      if (!contests) {
        console.log('No contests found in database');
        return [];
      }

      return contests;
    }
  });
};