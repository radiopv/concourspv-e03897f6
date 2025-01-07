import { useQuery } from "@tanstack/react-query";
import { supabase } from "../integrations/supabase/client";

export interface Participant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Participation {
  id: string;
  score: number | null;
  status: string;
  completed_at: string | null;
  participant: Participant;
}

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
          participant:participants!participant_id (
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('contest_id', contestId)
        .order('score', { ascending: false });
      
      if (error) {
        console.error('Error fetching participations:', error);
        throw error;
      }
      
      return data as Participation[];
    },
    enabled
  });
};