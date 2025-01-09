import { useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { supabase } from "../App";
import ContestStats from '@/components/contest/ContestStats';
import TopParticipantsList from '@/components/contest/TopParticipantsList';
import ContestGeneralStats from '@/components/contest/ContestGeneralStats';

interface LocationState {
  finalScore?: number;
}

const ContestStatsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const state = location.state as LocationState;

  const { data: contest } = useQuery({
    queryKey: ['contest', id],
    queryFn: async () => {
      const { data: contestData, error: contestError } = await supabase
        .from('contests')
        .select('*')
        .eq('id', id)
        .single();
      
      if (contestError) throw contestError;

      const { count: participantsCount } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true })
        .eq('contest_id', id);

      return {
        ...contestData,
        participants_count: participantsCount || 0
      };
    }
  });

  const { data: topParticipants } = useQuery({
    queryKey: ['top-participants', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participants')
        .select(`
          id,
          score,
          first_name,
          last_name
        `)
        .eq('contest_id', id)
        .order('score', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    }
  });

  const { data: stats } = useQuery({
    queryKey: ['contest-stats', id],
    queryFn: async () => {
      const { count: qualifiedCount } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true })
        .eq('contest_id', id)
        .gte('score', 70);

      const { data: scores } = await supabase
        .from('participants')
        .select('score')
        .eq('contest_id', id);

      const average = scores && scores.length > 0
        ? scores.reduce((acc, curr) => acc + (curr.score || 0), 0) / scores.length
        : 0;

      return {
        qualifiedCount: qualifiedCount || 0,
        averageScore: Math.round(average)
      };
    }
  });

  if (!contest || !stats) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {state?.finalScore && (
            <Card className="bg-gradient-to-r from-amber-100 to-amber-200 border-none">
              <CardContent className="p-6 text-center">
                <Trophy className="w-16 h-16 text-amber-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-amber-900 mb-2">
                  Félicitations !
                </h2>
                <p className="text-amber-800">
                  Votre score final est de {state.finalScore}% !
                  {state.finalScore >= 70 && (
                    <span className="block mt-2 font-medium">
                      Vous êtes éligible pour le tirage au sort ! 🎉
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>
          )}

          <ContestStats
            participantsCount={contest.participants_count}
            successPercentage={Math.round((stats.qualifiedCount / (contest.participants_count || 1)) * 100)}
            timeLeft=""
            endDate={contest.end_date}
          />

          {topParticipants && (
            <TopParticipantsList participants={topParticipants} />
          )}

          <ContestGeneralStats
            averageScore={stats.averageScore}
            qualifiedCount={stats.qualifiedCount}
            totalParticipants={contest.participants_count}
          />
        </div>
      </div>
    </div>
  );
};

export default ContestStatsPage;