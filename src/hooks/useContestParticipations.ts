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
          participant:participants!inner (
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

      // Vérification et transformation des données
      const validParticipations = data.map(item => {
        if (!item.participant) {
          console.warn(`Participation ${item.id} has no participant data`);
          return null;
        }
        return {
          ...item,
          participant: {
            id: item.participant.id,
            first_name: item.participant.first_name,
            last_name: item.participant.last_name,
            email: item.participant.email
          }
        };
      }).filter((item): item is Participation => item !== null);
      
      return validParticipations;
    },
    enabled
  });
};