
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Crown, Medal, Star, Award, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface GlobalStatsProps {
  globalStats: {
    total_points: number;
    best_streak: number;
    current_streak: number;
    current_rank: string;
  } | null;
}

const GlobalStatsCards = ({ globalStats }: GlobalStatsProps) => {
  // Requête pour obtenir les statistiques globales de l'utilisateur
  const { data: stats } = useQuery({
    queryKey: ['user-global-stats'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return null;

      // Récupérer les points de l'utilisateur
      const { data: userPoints, error: pointsError } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (pointsError) {
        console.error('Error fetching user points:', pointsError);
        return null;
      }

      // Récupérer le meilleur score de l'utilisateur
      const { data: bestScore, error: scoreError } = await supabase
        .from('participants')
        .select('score')
        .eq('id', session.user.id)
        .eq('status', 'completed')
        .order('score', { ascending: false })
        .limit(1)
        .single();

      if (scoreError && scoreError.code !== 'PGRST116') {
        console.error('Error fetching best score:', scoreError);
      }

      return {
        total_points: userPoints?.total_points || 0,
        best_streak: userPoints?.best_streak || 0,
        current_streak: userPoints?.current_streak || 0,
        current_rank: userPoints?.current_rank || 'NOVATO',
        best_score: bestScore?.score || 0
      };
    },
    refetchInterval: 30000 // Rafraîchir toutes les 30 secondes
  });

  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Meilleur Score
          </CardTitle>
          <Trophy className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.best_score}%</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Points Totaux
          </CardTitle>
          <Star className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_points} pts</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Meilleure Série
          </CardTitle>
          <Target className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.best_streak}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Rang Actuel
          </CardTitle>
          <Award className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.current_rank}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalStatsCards;
