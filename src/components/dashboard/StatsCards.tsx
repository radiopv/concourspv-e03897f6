import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Star, Trophy, Share2, Camera, MessageSquare } from "lucide-react";

interface StatsCardsProps {
  stats: {
    contests_participated?: number;
    total_points?: number;
    contests_won?: number;
  } | null;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  const participations = stats?.contests_participated || 0;
  const points = stats?.total_points || 0;
  const wins = stats?.contests_won || 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle>Comment gagner plus de points ?</CardTitle>
          <CardDescription>Multipliez vos chances de gagner</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Bonnes réponses</p>
                <p className="text-sm text-gray-600">1 point par bonne réponse</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Share2 className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Partage social</p>
                <p className="text-sm text-gray-600">+5 points par partage</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Camera className="h-5 w-5 text-purple-500" />
              <div>
                <p className="font-medium">Photo de profil</p>
                <p className="text-sm text-gray-600">+10 points bonus</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-amber-500" />
              <div>
                <p className="font-medium">Témoignage</p>
                <p className="text-sm text-gray-600">+15 points bonus</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;