import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Target, Euro, Award, Percent } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../App";

const GlobalContestStats = () => {
  const { data: stats } = useQuery({
    queryKey: ['global-contest-stats'],
    queryFn: async () => {
      // Récupérer tous les concours
      const { data: contests } = await supabase
        .from('contests')
        .select('id')
        .eq('status', 'active');

      // Récupérer tous les participants
      const { data: participants } = await supabase
        .from('participants')
        .select('score');

      // Récupérer tous les prix
      const { data: prizes } = await supabase
        .from('prizes')
        .select(`
          prize_catalog (
            value
          )
        `);

      const totalContests = contests?.length || 0;
      const totalParticipants = participants?.length || 0;
      const averageScore = participants?.length 
        ? participants.reduce((sum, p) => sum + (p.score || 0), 0) / participants.length 
        : 0;
      const qualifiedParticipants = participants?.filter(p => (p.score || 0) >= 70).length || 0;
      const totalPrizeValue = prizes?.reduce((sum, prize) => {
        return sum + (prize.prize_catalog?.[0]?.value || 0);
      }, 0) || 0;

      return {
        totalContests,
        totalParticipants,
        averageScore: Math.round(averageScore),
        qualifiedParticipants,
        totalPrizeValue: Math.round(totalPrizeValue),
        qualificationRate: totalParticipants 
          ? Math.round((qualifiedParticipants / totalParticipants) * 100)
          : 0
      };
    }
  });

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="bg-gradient-to-br from-amber-50 to-yellow-50">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Valeur Totale des Prix</CardTitle>
          <Euro className="w-4 h-4 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-700">{stats.totalPrizeValue}€</div>
          <p className="text-xs text-amber-600 mt-1">
            Répartis sur {stats.totalContests} concours actifs
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Score Moyen Global</CardTitle>
          <Target className="w-4 h-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">{stats.averageScore}%</div>
          <p className="text-xs text-blue-600 mt-1">
            Sur {stats.totalParticipants} participants
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Taux de Qualification</CardTitle>
          <Award className="w-4 h-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">{stats.qualificationRate}%</div>
          <p className="text-xs text-green-600 mt-1">
            {stats.qualifiedParticipants} participants qualifiés
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalContestStats;