import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import TopParticipantsList from "@/components/contest/TopParticipantsList";
import CommunityStats from "@/components/points/CommunityStats";
import PointsGuide from "@/components/points/PointsGuide";
import RanksExplanation from "@/components/points/RanksExplanation";
import ExtraParticipations from "@/components/points/ExtraParticipations";

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

  const { data: topParticipants } = useQuery({
    queryKey: ['top-participants'],
    queryFn: async () => {
      const { data: pointsData, error: pointsError } = await supabase
        .from('user_points')
        .select('user_id, total_points')
        .order('total_points', { ascending: false })
        .limit(10);

      if (pointsError) throw pointsError;
      if (!pointsData?.length) return [];

      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('id, first_name, last_name')
        .in('id', pointsData.map(p => p.user_id));

      if (membersError) throw membersError;

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

          {stats && (
            <CommunityStats
              totalUsers={stats.totalUsers}
              averagePoints={stats.averagePoints}
              mostCommonRank={stats.mostCommonRank}
            />
          )}

          {topParticipants && (
            <TopParticipantsList participants={topParticipants} />
          )}

          <PointsGuide />
          <RanksExplanation />
          <ExtraParticipations />
        </div>
      </div>
    </div>
  );
};

export default PointsSystem;