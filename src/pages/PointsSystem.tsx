import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, Award, Gift, TrendingUp, Users, Medal } from "lucide-react";
import { RANKS } from "@/services/pointsService";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import TopParticipantsList from "@/components/contest/TopParticipantsList";

interface UserStats {
  totalUsers: number;
  averagePoints: number;
  rankDistribution: Record<string, number>;
  mostCommonRank: string;
}

const PointsSystem = () => {
  const { data: stats } = useQuery<UserStats>({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_points')
        .select('total_points, current_rank')
        .not('total_points', 'is', null);

      if (error) throw error;

      const totalUsers = data.length;
      const averagePoints = data.reduce((acc, user) => acc + (user.total_points || 0), 0) / totalUsers;
      const rankDistribution = data.reduce((acc, user) => {
        if (user.current_rank) {
          acc[user.current_rank] = (acc[user.current_rank] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const mostCommonRank = Object.entries(rankDistribution)
        .reduce((a, b) => rankDistribution[a[0]] > rankDistribution[b[0]] ? a : b)[0];

      return {
        totalUsers,
        averagePoints,
        rankDistribution,
        mostCommonRank
      };
    }
  });

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center mb-12">
            <h1 className="page-title">
              Système de Points
            </h1>
            <p className="text-xl text-amber-800/80">
              Découvrez comment gagner des points et débloquer des avantages exclusifs !
            </p>
          </div>

          {/* Statistiques des membres */}
          {stats && (
            <Card className="tropical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <Users className="w-6 h-6 text-amber-500" />
                  Statistiques de la communauté
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div className="warm-gradient p-4 rounded-lg border border-amber-100">
                  <h3 className="font-semibold mb-2 flex items-center gap-2 text-amber-800">
                    <Users className="w-5 h-5 text-amber-500" />
                    Membres actifs
                  </h3>
                  <p className="text-2xl font-bold text-amber-900">{stats.totalUsers}</p>
                </div>
                <div className="warm-gradient p-4 rounded-lg border border-amber-100">
                  <h3 className="font-semibold mb-2 flex items-center gap-2 text-amber-800">
                    <Star className="w-5 h-5 text-amber-500" />
                    Points moyens
                  </h3>
                  <p className="text-2xl font-bold text-amber-900">{Math.round(stats.averagePoints)}</p>
                </div>
                <div className="warm-gradient p-4 rounded-lg border border-amber-100">
                  <h3 className="font-semibold mb-2 flex items-center gap-2 text-amber-800">
                    <Award className="w-5 h-5 text-amber-500" />
                    Rang le plus commun
                  </h3>
                  <p className="text-2xl font-bold text-amber-900">{stats.mostCommonRank}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top 10 des participants */}
          <div className="content-section">
            {topParticipants && <TopParticipantsList participants={topParticipants} />}
          </div>

          <Card className="tropical-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <Trophy className="w-6 h-6 text-amber-500" />
                Comment gagner des points
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="warm-gradient p-4 rounded-lg border border-amber-100">
                  <h3 className="font-semibold mb-2 flex items-center gap-2 text-amber-800">
                    <Star className="w-5 h-5 text-amber-500" />
                    Points de base
                  </h3>
                  <p className="text-amber-800">1 point par bonne réponse</p>
                </div>
                <div className="warm-gradient p-4 rounded-lg border border-amber-100">
                  <h3 className="font-semibold mb-2 flex items-center gap-2 text-amber-800">
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                    Points bonus
                  </h3>
                  <p className="text-amber-800">5 points bonus pour 10 bonnes réponses consécutives</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="tropical-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <Award className="w-6 h-6 text-amber-500" />
                Rangs et Avantages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {RANKS.map((rank) => (
                  <div key={rank.rank} className="warm-gradient p-4 rounded-lg border border-amber-100">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold flex items-center gap-2 text-amber-800">
                        <span className="text-2xl">{rank.badge}</span>
                        {rank.rank}
                      </h3>
                      <span className="text-sm text-amber-700">
                        {rank.minPoints} - {rank.maxPoints === Infinity ? "∞" : rank.maxPoints} points
                      </span>
                    </div>
                    <ul className="list-disc list-inside text-amber-800 space-y-1">
                      {rank.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="tropical-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <Gift className="w-6 h-6 text-amber-500" />
                Participations Supplémentaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-800 mb-4">
                Tous les 25 points cumulés, vous gagnez 2 participations supplémentaires aux concours !
              </p>
              <div className="warm-gradient p-4 rounded-lg border border-amber-100">
                <p className="text-sm text-amber-800">
                  Exemple : avec 75 points, vous aurez gagné 6 participations supplémentaires.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PointsSystem;