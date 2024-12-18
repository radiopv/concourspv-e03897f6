import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useContests = () => {
  const { data: contests, error, isLoading } = useQuery({
    queryKey: ['contests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select('*');

      if (error) throw error;
      return data;
    }
  });

  return { contests, error, isLoading };
};
