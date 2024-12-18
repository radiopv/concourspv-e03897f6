import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../App";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";
import { useState, useEffect } from "react";
import ContestHeader from "@/components/contest/ContestHeader";
import ContestStats from "@/components/contest/ContestStats";
import ContestPrizes from "@/components/contest/ContestPrizes";
import QuestionnaireComponent from "@/components/QuestionnaireComponent";

const Contest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  const { data: contest, isLoading: contestLoading } = useQuery({
    queryKey: ['contest', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          prizes (*),
          participants (count)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const { data: stats } = useQuery({
    queryKey: ['contest-stats', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participants')
        .select('score')
        .eq('contest_id', id)
        .gte('score', 70);
      
      if (error) throw error;
      return {
        successCount: data.length
      };
    },
    enabled: !!contest?.participants_count
  });

  useEffect(() => {
    if (!contest?.end_date) return;

    const updateTimeLeft = () => {
      const now = new Date();
      const endDate = new Date(contest.end_date);
      
      if (now >= endDate) {
        setTimeLeft("Concours terminé");
        return;
      }

      const days = differenceInDays(endDate, now);
      const hours = differenceInHours(endDate, now) % 24;
      const minutes = differenceInMinutes(endDate, now) % 60;

      setTimeLeft(`${days}j ${hours}h ${minutes}m`);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000);
    return () => clearInterval(interval);
  }, [contest?.end_date]);

  if (contestLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center">
        <Card className="max-w-lg w-full mx-4">
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">
              Concours non trouvé
            </h2>
            <p className="text-gray-600">
              Le concours que vous recherchez n'existe pas ou n'est plus disponible.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showQuestionnaire) {
    return <QuestionnaireComponent contestId={id || ''} />;
  }

  const successPercentage = contest.participants_count > 0 && stats
    ? Math.round((stats.successCount / contest.participants_count) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <ContestHeader 
            title={contest.title}
            description={contest.description}
          />

          <ContestStats
            participantsCount={contest.participants_count || 0}
            successPercentage={successPercentage}
            timeLeft={timeLeft}
            endDate={contest.end_date}
          />

          <ContestPrizes prizes={contest.prizes || []} />

          <div className="text-center">
            <Button
              size="lg"
              onClick={() => navigate('/contests')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg px-8 py-6 h-auto animate-pulse"
            >
              Voir les concours disponibles
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contest;