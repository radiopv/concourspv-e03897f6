import { useQuery } from "@tanstack/react-query";
import { supabase } from "../App";
import { Contest } from "../types/contest";

export const useContests = () => {
  return useQuery<Contest[]>({
    queryKey: ['contests'],
    queryFn: async () => {
      console.log('Fetching contests...');
      const { data, error } = await supabase
        .from('contests')
        .select(`
          id,
          title,
          description,
          is_new,
          has_big_prizes,
          status,
          participants (
            id,
            first_name,
            last_name,
            score,
            status,
            created_at,
            participant_prizes (
              prize:prizes (
                catalog_item:prize_catalog (
                  id,
                  name,
                  value,
                  image_url
                )
              )
            )
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contests:', error);
        throw error;
      }

      // Type assertion to ensure the data matches our Contest interface
      return data as Contest[];
    }
  });
};