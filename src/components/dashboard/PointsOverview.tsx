import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award, Star, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getPointHistory, getUserPoints, RANKS } from "@/services/pointsService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const PointsOverview = () => {
  const { user } = useAuth();

  const { data: points } = useQuery({
    queryKey: ['user-points', user?.id],
    queryFn: () => getUserPoints(user?.id!),
    enabled: !!user?.id
  });

  const { data: history } = useQuery({
    queryKey: ['points-history', user?.id],
    queryFn: () => getPointHistory(user?.id!),
    enabled: !!user?.id
  });

  if (!points) return null;

  const currentRankInfo = RANKS.find(r => r.rank === points.current_rank);
  const nextRankInfo = RANKS.find(r => r.minPoints > points.total_points);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            Vos Points et Récompenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-6 h-6 text-amber-500" />
                <h3 className="text-lg font-semibold">Rang actuel</h3>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{currentRankInfo?.badge}</span>
                <span className="text-2xl font-medium">{currentRankInfo?.rank}</span>
              </div>
              <p className="text-gray-600">{currentRankInfo?.description}</p>
              {nextRankInfo && (
                <div className="mt-4 p-4 bg-white/50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Prochain rang : {nextRankInfo.rank} ({nextRankInfo.badge})
                  </p>
                  <p className="text-sm text-gray-600">
                    Points nécessaires : {nextRankInfo.minPoints - points.total_points} points
                  </p>
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-purple-500" />
                  <h3 className="font-semibold">Total des points</h3>
                </div>
                <p className="text-2xl font-bold">{points.total_points}</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold">Meilleure série</h3>
                </div>
                <p className="text-2xl font-bold">{points.best_streak}</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold">Participations bonus</h3>
                </div>
                <p className="text-2xl font-bold">{points.extra_participations}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {history && history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historique des points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {history.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">
                      {entry.points > 0 ? "+" : ""}{entry.points} points
                      {entry.contests?.title && ` - ${entry.contests.title}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(entry.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                    </p>
                  </div>
                  {entry.streak > 0 && (
                    <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Série de {entry.streak}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PointsOverview;