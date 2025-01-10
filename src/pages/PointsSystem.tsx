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
  // Fetch user statistics
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

  // Fetch top participants
  const { data: topParticipants } = useQuery({
    queryKey: ['top-participants'],
    queryFn: async () => {
      // First, get top user_points
      const { data: pointsData, error: pointsError } = await supabase
        .from('user_points')
        .select('user_id, total_points')
        .order('total_points', { ascending: false })
        .limit(10);

      if (pointsError) throw pointsError;

      if (!pointsData?.length) return [];

      // Then, get the corresponding member details
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('id, first_name, last_name')
        .in('id', pointsData.map(p => p.user_id));

      if (membersError) throw membersError;

      // Combine the data
      return pointsData.map(points => {
        const member = membersData.find(m => m.id === points.user_id);
        return {
          id: points.user_id,
          first_name: member?.first_name || 'Unknown',
          last_name: member?.last_name || 'User',
          score: points.total_points
        };
      });
    }
  });

  // ... keep existing code (JSX for rendering the points system UI)

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Système de Points
            </h1>
            <p className="text-xl text-gray-600">
              Découvrez comment gagner des points et débloquer des avantages exclusifs !
            </p>
          </div>

          {/* Statistiques des membres */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-500" />
                  Statistiques de la communauté
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-white rounded-lg border">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    Membres actifs
                  </h3>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Points moyens
                  </h3>
                  <p className="text-2xl font-bold">{Math.round(stats.averagePoints)}</p>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-500" />
                    Rang le plus commun
                  </h3>
                  <p className="text-2xl font-bold">{stats.mostCommonRank}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top 10 des participants */}
          {topParticipants && (
            <TopParticipantsList participants={topParticipants} />
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-500" />
                Comment gagner des points
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-white rounded-lg border">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Points de base
                  </h3>
                  <p className="text-gray-600">1 point par bonne réponse</p>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Points bonus
                  </h3>
                  <p className="text-gray-600">5 points bonus pour 10 bonnes réponses consécutives</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-6 h-6 text-purple-500" />
                Rangs et Avantages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {RANKS.map((rank) => (
                  <div key={rank.rank} className="p-4 bg-white rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold flex items-center gap-2">
                        <span className="text-2xl">{rank.badge}</span>
                        {rank.rank}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {rank.minPoints} - {rank.maxPoints === Infinity ? "∞" : rank.maxPoints} points
                      </span>
                    </div>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {rank.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-6 h-6 text-pink-500" />
                Participations Supplémentaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Tous les 25 points cumulés, vous gagnez 2 participations supplémentaires aux concours !
              </p>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-600">
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
