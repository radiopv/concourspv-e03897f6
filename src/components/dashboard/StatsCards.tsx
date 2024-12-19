import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Star, Trophy } from "lucide-react";

interface StatsCardsProps {
  stats: {
    contests_participated: number;
    total_points: number;
    contests_won: number;
  } | null;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  // Valeurs par défaut si stats est null
  const defaultStats = {
    contests_participated: 0,
    total_points: 0,
    contests_won: 0
  };

  // Utiliser les valeurs de stats s'il existe, sinon utiliser les valeurs par défaut
  const displayStats = stats || defaultStats;

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
          <p className="text-3xl font-bold">{displayStats.contests_participated}</p>
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
          <p className="text-3xl font-bold">{Math.round(displayStats.total_points)}</p>
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
          <p className="text-3xl font-bold">{displayStats.contests_won}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;