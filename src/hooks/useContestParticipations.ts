import { useQuery } from "@tanstack/react-query";
import { supabase } from "../integrations/supabase/client";

export const useContestParticipations = (contestId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['contest-participations', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participations')
        .select(`
          id,
          score,
          status,
          completed_at,
          participant:participants (
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('contest_id', contestId)
        .order('score', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled
  });
};