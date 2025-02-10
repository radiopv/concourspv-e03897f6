
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const useContests = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['active-contests'],
    queryFn: async () => {
      console.log('Fetching contests...');
      
      const { data: contests, error } = await supabase
        .from('contests')
        .select(`
          *,
          participants(
            score,
            status
          ),
          questions(count),
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

      // Pour chaque concours, calculer les statistiques détaillées
      const processedContests = contests.map(contest => {
        // Obtenir tous les participants qui ont complété le concours
        const completedParticipants = contest.participants?.filter(p => 
          p.status === 'completed' || p.status === 'eligible'
        ) || [];

        // Calculer le nombre de participants éligibles (score >= 80)
        const eligibleParticipants = completedParticipants.filter(p => p.score >= 80);

        // Calculer le score moyen
        const totalScore = completedParticipants.reduce((acc, p) => acc + (p.score || 0), 0);
        const averageScore = completedParticipants.length > 0
          ? Math.round(totalScore / completedParticipants.length)
          : 0;

        console.log('Contest stats:', {
          id: contest.id,
          totalParticipants: completedParticipants.length,
          eligibleParticipants: eligibleParticipants.length,
          averageScore,
          scores: completedParticipants.map(p => p.score)
        });

        return {
          ...contest,
          participants: { count: completedParticipants.length },
          questions: { count: contest.questions?.[0]?.count || 0 },
          stats: {
            totalParticipants: completedParticipants.length,
            eligibleParticipants: eligibleParticipants.length,
            averageScore
          },
          prizes: contest.prizes?.map(prize => ({
            id: prize.id,
            name: prize.prize_catalog.name,
            description: prize.prize_catalog.description,
            image_url: prize.prize_catalog.image_url,
            shop_url: prize.prize_catalog.shop_url,
            value: prize.prize_catalog.value
          })) || []
        };
      });

      console.log('Processed contests:', processedContests);
      return processedContests;
    },
    retry: 1,
    refetchOnWindowFocus: false,
    refetchInterval: 300000, // 5 minutes
    staleTime: 300000, // 5 minutes
  });
};
