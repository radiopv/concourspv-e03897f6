import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const ContestStats = () => {
  const { contestId } = useParams();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalParticipants: 0,
    completedParticipants: 0,
    averageScore: 0,
  });

  const { data: contest, isLoading: isLoadingContest } = useQuery({
    queryKey: ['contest', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select('*')
        .eq('id', contestId)
        .single();

      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: participants, error } = await supabase
          .from('participants')
          .select('status, score')
          .eq('contest_id', contestId);

        if (error) throw error;

        const totalParticipants = participants.length;
        const completedParticipants = participants.filter(p => p.status === 'completed').length;
        const scores = participants.map(p => p.score || 0);
        const averageScore = scores.length > 0
          ? scores.reduce((a, b) => a + b, 0) / scores.length
          : 0;

        setStats({
          totalParticipants,
          completedParticipants,
          averageScore,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les statistiques",
          variant: "destructive",
        });
      }
    };

    if (contestId) {
      fetchStats();
    }
  }, [contestId, toast]);

  if (isLoadingContest) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{contest?.title} - Statistiques</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.totalParticipants}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Participations complètes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.completedParticipants}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Score moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.averageScore.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContestStats;