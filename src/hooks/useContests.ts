
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
          participants(count),
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
      const processedContests = await Promise.all(contests.map(async contest => {
        // Récupérer tous les participants avec leurs scores
        const { data: participants } = await supabase
          .from('participants')
          .select('score, status')
          .eq('contest_id', contest.id)
          .not('status', 'eq', 'pending');

        // Calculer les statistiques
        const validParticipants = participants?.filter(p => p.score !== null && p.score > 0) || [];
        const eligibleParticipants = participants?.filter(p => p.score >= 80) || [];
        const averageScore = validParticipants.length > 0
          ? Math.round(validParticipants.reduce((acc, p) => acc + (p.score || 0), 0) / validParticipants.length)
          : 0;

        return {
          ...contest,
          participants: { count: participants?.length || 0 },
          questions: { count: contest.questions?.[0]?.count || 0 },
          stats: {
            totalParticipants: participants?.length || 0,
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
