
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Prize } from "@/types/prize";

interface PrizeWithCatalog {
  id: string;
  prize_catalog_id: string;
  prize_catalog: {
    name: string | null;
    description: string | null;
    image_url: string | null;
    shop_url: string | null;
    value: number | null;
  } | null;
}

interface ContestParticipant {
  score: number;
  status: string;
}

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
          is_featured,
          is_exclusive,
          is_limited,
          is_vip,
          is_rank_restricted,
          min_rank,
          start_date,
          end_date,
          draw_date,
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
        const { data: participants } = await supabase
          .from('participants')
          .select('score, status')
          .eq('contest_id', contest.id)
          .not('status', 'eq', 'reset');

        console.log(`Participants for contest ${contest.id}:`, participants);

        const validParticipants = (participants as ContestParticipant[] || []).filter(p => 
          p.status === 'completed' && 
          typeof p.score === 'number' && 
          p.score > 0
        );

        console.log('Valid participants:', validParticipants);

        const eligibleParticipants = validParticipants.filter(p => p.score >= 80);

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

        const prizes: Prize[] = (Array.isArray(contest.prizes) ? contest.prizes : []).map((prize: any) => ({
          id: prize.id,
          name: prize.prize_catalog?.name || '',
          description: prize.prize_catalog?.description || '',
          image_url: prize.prize_catalog?.image_url || '',
          shop_url: prize.prize_catalog?.shop_url || '',
          value: prize.prize_catalog?.value || 0
        }));

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
    refetchOnWindowFocus: true,
    refetchInterval: 10000, // Rafraîchir toutes les 10 secondes
    staleTime: 5000, // Considérer les données comme périmées après 5 secondes
    gcTime: 0, // Désactiver le cache
  });
};
