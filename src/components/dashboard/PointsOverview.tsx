import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award, Star, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getPointHistory, getUserPoints } from "@/services/pointsService";
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
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold">Rang actuel</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{points.current_rank.badge}</span>
                <span className="text-lg font-medium">{points.current_rank.rank}</span>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold">Total des points</h3>
              </div>
              <p className="text-2xl font-bold">{points.total_points}</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold">Meilleure série</h3>
              </div>
              <p className="text-2xl font-bold">{points.best_streak}</p>
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