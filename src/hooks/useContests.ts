import { useQuery } from "@tanstack/react-query";
import { supabase } from "../App";
import { Contest } from "../types/contest";

export const useContests = () => {
  return useQuery<Contest[]>({
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
      return data as Contest[];
    }
  });
};