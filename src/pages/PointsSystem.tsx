import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import CommunityStats from '@/components/points/CommunityStats';
import RanksList from '@/components/points/RanksList';
import ExtraParticipations from '@/components/points/ExtraParticipations';
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

          {stats && <CommunityStats stats={stats} />}
          <RanksList />
          <ExtraParticipations />
        </div>
      </div>
    </div>
  );
};

export default PointsSystem;