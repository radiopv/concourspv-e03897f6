import { useQuery } from "@tanstack/react-query";
import { supabase } from "../integrations/supabase/client";
import { Contest, Participant } from "../types/contest";

export const useContests = () => {
  return useQuery({
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
            email,
            score,
            status,
            created_at,
            participant_prizes (
              prize_id,
              prizes (
                catalog_item_id,
                prize_catalog (
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

      console.log('Contests data:', data);

      return data.map((contest: any) => ({
        id: contest.id,
        title: contest.title,
        description: contest.description,
        is_new: contest.is_new,
        has_big_prizes: contest.has_big_prizes,
        status: contest.status,
        participants: contest.participants?.map((p: any) => ({
          id: p.id,
          first_name: p.first_name,
          last_name: p.last_name,
          email: p.email,
          score: p.score,
          status: p.status,
          created_at: p.created_at,
          participant_prizes: p.participant_prizes?.map((pp: any) => ({
            prize: {
              catalog_item: pp.prizes?.prize_catalog
            }
          })) || []
        })) || []
      }));
    }
  });
};