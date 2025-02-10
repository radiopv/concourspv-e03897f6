
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Prize } from "@/types/prize";

export const useContests = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['active-contests'],
    queryFn: async () => {
      console.log('Fetching contests...');
      
      const { data: contests, error } = await supabase
        .from('contests')
        .select(`
          id,
          title,
          description,
          status,
          is_new,
          has_big_prizes,
          is_rank_restricted,
          min_rank,
          start_date,
          end_date,
          prizes(
            id,
            prize_catalog_id,
            prize_catalog(
              name,
              description,
              image_url,
              shop_url,
              value
            )
          )
        `)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching contests:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les concours.",
        });
        throw error;
      }

      console.log('Raw contests data:', contests);

      if (!contests || contests.length === 0) {
        console.log('No contests found in database');
        return [];
      }

      // Fetch participants data separately for each contest
      const processedContests = await Promise.all(contests.map(async contest => {
        // Get all participants for this contest
        const { data: participants } = await supabase
          .from('participants')
          .select('score, status')
          .eq('contest_id', contest.id);

        console.log(`Participants for contest ${contest.id}:`, participants);

        // Only consider completed participants with a valid score
        const validParticipants = participants?.filter(p => 
          p.status === 'completed' && 
          typeof p.score === 'number' && 
          p.score > 0
        ) || [];

        console.log('Valid participants:', validParticipants);

        // Calculate eligible participants (those with score >= 80)
        const eligibleParticipants = validParticipants.filter(p => p.score >= 80);

        // Calculate average score
        const totalScore = validParticipants.reduce((acc, p) => acc + (p.score || 0), 0);
        const averageScore = validParticipants.length > 0
          ? Math.round(totalScore / validParticipants.length)
          : 0;

        console.log('Contest stats:', {
          id: contest.id,
          validParticipants: validParticipants.length,
          eligibleParticipants: eligibleParticipants.length,
          averageScore,
          scores: validParticipants.map(p => p.score)
        });

        // Transform prizes data
        const prizes: Prize[] = contest.prizes?.map(prize => ({
          id: prize.id,
          name: prize.prize_catalog?.name || '',
          description: prize.prize_catalog?.description || '',
          image_url: prize.prize_catalog?.image_url || '',
          shop_url: prize.prize_catalog?.shop_url || '',
          value: prize.prize_catalog?.value || 0
        })) || [];

        return {
          ...contest,
          participants: { count: validParticipants.length },
          stats: {
            totalParticipants: validParticipants.length,
            eligibleParticipants: eligibleParticipants.length,
            averageScore
          },
          prizes
        };
      }));

      console.log('Processed contests:', processedContests);
      return processedContests;
    },
    retry: 1,
    refetchOnWindowFocus: false,
    refetchInterval: 300000, // 5 minutes
    staleTime: 300000, // 5 minutes
  });
};
