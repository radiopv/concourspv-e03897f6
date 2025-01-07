import { useQuery } from "@tanstack/react-query";
import { supabase } from "../App";
import { Contest, Participant, ParticipantPrize } from "../types/contest";

const transformParticipantPrizes = (prizes: any[]): ParticipantPrize[] => {
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

const fetchContests = async () => {
  console.log('Fetching contests...');
  const { data: contestsData, error } = await supabase
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
    .eq('status', 'active');

  if (error) {
    console.error('Error fetching contests:', error);
    throw error;
  }

  // Transform the data to match our types
  const transformedData: Contest[] = contestsData.map((contest: any) => ({
    id: contest.id,
    title: contest.title,
    description: contest.description,
    is_new: contest.is_new,
    has_big_prizes: contest.has_big_prizes,
    status: contest.status,
    participants: transformParticipants(contest.participants || [])
  }));

  return transformedData;
};

export const useContests = () => {
  return useQuery({
    queryKey: ['contests'],
    queryFn: fetchContests,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes (previously cacheTime)
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: true
  });
};