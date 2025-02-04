import { Card } from "@/components/ui/card";
import RanksList from "@/components/points/RanksList";
import CommunityStats from "@/components/points/CommunityStats";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const Points = () => {
  const { data: stats } = useQuery({
    queryKey: ['community-stats'],
    queryFn: async () => {
      console.log('Fetching community stats...');
      
      // Récupérer le nombre total de participants
      const { count: participantsCount } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true });

      // Récupérer le nombre de concours actifs
      const { count: contestsCount } = await supabase
        .from('contests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Récupérer le meilleur score
      const { data: topScoreData } = await supabase
        .from('participants')
        .select('score')
        .order('score', { ascending: false })
        .limit(1)
        .maybeSingle();

      console.log('Stats fetched:', {
        participantsCount,
        contestsCount,
        topScoreData
      });

      return {
        totalParticipants: participantsCount || 0,
        totalContests: contestsCount || 0,
        topScore: topScoreData?.score || 0
      };
    }
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Système de Points</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Rangs et Avantages</h2>
          <RanksList />
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Statistiques de la Communauté</h2>
          {stats && <CommunityStats {...stats} />}
        </Card>
      </div>
    </div>
  );
};

export default Points;