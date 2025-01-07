import { useQuery } from "@tanstack/react-query";
import { supabase } from "../App";
import { Contest, Participant, ParticipantPrize } from "../types/contest";

const transformParticipantPrizes = (prizes: any[]): ParticipantPrize[] => {
  console.log('Transforming prizes:', prizes);
  return prizes?.map((pp: any) => ({
    prize: {
      catalog_item: {
        id: pp.prize.catalog_item.id,
        name: pp.prize.catalog_item.name,
        value: pp.prize.catalog_item.value,
        image_url: pp.prize.catalog_item.image_url
      }
    }
  })) || [];
};

const transformParticipants = (participants: any[]): Participant[] => {
  console.log('Transforming participants:', participants);
  return participants?.map((participant: any) => ({
    id: participant.id,
    first_name: participant.first_name,
    last_name: participant.last_name,
    score: participant.score,
    status: participant.status,
    created_at: participant.created_at,
    participant_prizes: transformParticipantPrizes(participant.participant_prizes || [])
  })) || [];
};

export const useContests = () => {
  return useQuery<Contest[]>({
    queryKey: ['contests'],
    queryFn: async () => {
      console.log('Starting contests fetch...');
      
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

      console.log('Raw contests data:', data);

      const transformedData: Contest[] = data.map((contest: any) => ({
        id: contest.id,
        title: contest.title,
        description: contest.description,
        is_new: contest.is_new,
        has_big_prizes: contest.has_big_prizes,
        status: contest.status,
        participants: transformParticipants(contest.participants || [])
      }));

      console.log('Transformed contests data:', transformedData);
      return transformedData;
    }
  });
};