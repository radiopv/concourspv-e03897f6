import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Target, DollarSign, Award, Percent } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../App";

interface ContestStatsProps {
  contestId: string;
}

interface Participant {
  score: number | null;
}

interface PrizeCatalog {
  value: number;
}

interface Prize {
  prize_catalog: PrizeCatalog | null;
}

const ContestStats = ({ contestId }: ContestStatsProps) => {
  const { data: stats } = useQuery({
    queryKey: ['contest-stats', contestId],
    queryFn: async () => {
      // Récupérer les statistiques de participation
      const { data: participantsData } = await supabase
        .from('participants')
        .select('score')
        .eq('contest_id', contestId);

      // Récupérer les prix du concours
      const { data: prizesData } = await supabase
        .from('prizes')
        .select(`
          prize_catalog (
            value
          )
        `)
        .eq('contest_id', contestId);

      // Calculer la valeur totale des prix
      const totalPrizeValue = (prizesData as Prize[] || []).reduce((total, prize) => {
        return total + (prize.prize_catalog?.value || 0);
      }, 0);

      // Calculer le score moyen
      const participants = participantsData as Participant[] || [];
      const averageScore = participants.length 
        ? participants.reduce((sum, p) => sum + (p.score || 0), 0) / participants.length 
        : 0;

      // Calculer le nombre de participants qualifiés (score >= 70%)
      const qualifiedCount = participants.filter(p => (p.score || 0) >= 70).length;

      return {
        participantsCount: participants.length,
        averageScore: Math.round(averageScore),
        qualifiedCount,
        totalPrizeValue: Math.round(totalPrizeValue),
        qualificationRate: participants.length 
          ? Math.round((qualifiedCount / participants.length) * 100) 
          : 0
      };
    }
  });

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Valeur des Prix</CardTitle>
          <DollarSign className="w-4 h-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-700">{stats.totalPrizeValue}€</div>
          <p className="text-xs text-purple-600 mt-1">Valeur totale des lots à gagner</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Score Moyen</CardTitle>
          <Target className="w-4 h-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">{stats.averageScore}%</div>
          <p className="text-xs text-blue-600 mt-1">Score moyen des participants</p>
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
            {stats.qualifiedCount} participants qualifiés
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContestStats;