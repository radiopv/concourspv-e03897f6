import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Star, Trophy } from "lucide-react";

interface StatsCardsProps {
  stats: {
    contests_participated?: number;
    total_points?: number;
    contests_won?: number;
  } | null;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  // Default values if stats is null or properties are undefined
  const participations = stats?.contests_participated || 0;
  const points = stats?.total_points || 0;
  const wins = stats?.contests_won || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-500" />
            Participations
          </CardTitle>
          <CardDescription>Total des concours participés</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{participations}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-500" />
            Points
          </CardTitle>
          <CardDescription>Points accumulés</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{Math.round(points)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Trophy className="h-6 w-6 text-green-500" />
            Victoires
          </CardTitle>
          <CardDescription>Concours gagnés</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{wins}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;