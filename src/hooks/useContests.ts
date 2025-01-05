import { useQuery } from "@tanstack/react-query";
import { supabase } from "../App";

export const useContests = () => {
  return useQuery({
    queryKey: ['contests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          participants:participants (
            count,
            data:* (
              id,
              first_name,
              last_name,
              score,
              status,
              updated_at
            )
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });
};