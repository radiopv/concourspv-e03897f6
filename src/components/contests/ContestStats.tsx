import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Target, Euro, Award, Percent } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../App";

interface ContestStatsProps {
  contestId: string;
}

interface Participant {
  score: number | null;
}

interface PrizeCatalogItem {
  value: number;
}

interface Prize {
  prize_catalog: PrizeCatalogItem[];
}

const ContestStats = ({ contestId }: ContestStatsProps) => {
  const { data: stats } = useQuery({
    queryKey: ['contest-stats', contestId],
    queryFn: async () => {
      const { data: participantsData } = await supabase
        .from('participants')
        .select('score')
        .eq('contest_id', contestId);

      const { data: prizesData } = await supabase
        .from('prizes')
        .select(`
          prize_catalog (
            value
          )
        `)
        .eq('contest_id', contestId);

      const participants = participantsData as Participant[] || [];
      const prizes = prizesData as Prize[] || [];

      const totalPrizeValue = prizes.reduce((total, prize) => {
        return total + (prize.prize_catalog[0]?.value || 0);
      }, 0);

      const averageScore = participants.length 
        ? participants.reduce((sum, p) => sum + (p.score || 0), 0) / participants.length 
        : 0;

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
          <Euro className="w-4 h-4 text-purple-600" />
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