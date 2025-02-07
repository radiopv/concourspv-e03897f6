
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Crown, Medal, Star, Award, Target } from 'lucide-react';

interface GlobalStatsProps {
  globalStats: {
    total_points: number;
    best_streak: number;
    current_streak: number;
    current_rank: string;
  } | null;
}

const GlobalStatsCards = ({ globalStats }: GlobalStatsProps) => {
  if (!globalStats) return null;

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
          <div className="text-2xl font-bold">{globalStats.total_points || 0} pts</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Meilleure Série
          </CardTitle>
          <Star className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{globalStats.best_streak || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Série Actuelle Record
          </CardTitle>
          <Target className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{globalStats.current_streak || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Rang Maximum
          </CardTitle>
          <Award className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{globalStats.current_rank || 'NOVATO'}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalStatsCards;
