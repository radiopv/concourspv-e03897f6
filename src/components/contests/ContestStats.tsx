
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface ContestStatsProps {
  contestId: string;
}

const ContestStats = ({ contestId }: ContestStatsProps) => {
  const { data: stats } = useQuery({
    queryKey: ['contest-stats', contestId],
    queryFn: async () => {
      console.log('Fetching contest stats for:', contestId);
      
      // Récupérer tous les participants qui ont terminé
      const { data: participantsData, error } = await supabase
        .from('participants')
        .select('score')
        .eq('contest_id', contestId)
        .eq('status', 'completed')
        .gt('score', 0) // Exclure les scores nuls ou négatifs
        .order('score', { ascending: false });

      if (error) {
        console.error('Error fetching participants:', error);
        throw error;
      }

      console.log('Raw participants data:', participantsData);

      // Filtrer les scores valides (>= 90%)
      const validScores = participantsData?.filter(p => p.score != null && p.score >= 90) || [];
      const totalParticipants = participantsData?.length || 0;
      
      console.log('Valid scores:', validScores);

      // Calculer le score moyen
      const averageScore = totalParticipants > 0
        ? Math.round(participantsData.reduce((sum, p) => sum + p.score, 0) / totalParticipants)
        : 0;

      console.log('Score calculation:', {
        totalParticipants,
        qualifiedParticipants: validScores.length,
        sum: participantsData?.reduce((sum, p) => sum + p.score, 0) || 0,
        averageScore
      });

      return {
        participantsCount: totalParticipants,
        averageScore,
      };
    }
  });

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Participants</CardTitle>
          <Users className="w-4 h-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">{stats.participantsCount}</div>
          <p className="text-xs text-blue-600 mt-1">Nombre total de participants</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Score Moyen</CardTitle>
          <Target className="w-4 h-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-700">{stats.averageScore}%</div>
          <p className="text-xs text-purple-600 mt-1">Score moyen des participants</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContestStats;
