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

      // Transform the data to match our types
      const transformedData = data.map((contest: any) => ({
        id: contest.id,
        title: contest.title,
        description: contest.description,
        is_new: contest.is_new,
        has_big_prizes: contest.has_big_prizes,
        status: contest.status,
        participants: contest.participants?.map((participant: any) => ({
          id: participant.id,
          first_name: participant.first_name,
          last_name: participant.last_name,
          score: participant.score,
          status: participant.status,
          created_at: participant.created_at,
          participant_prizes: participant.participant_prizes?.map((pp: any) => ({
            prize: {
              catalog_item: pp.prize.catalog_item
            }
          }))
        }))
      })) as Contest[];

      return transformedData;
    }
  });
};