import React from 'react';
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import CommunityStats from '@/components/points/CommunityStats';
import RanksList from '@/components/points/RanksList';
import ExtraParticipations from '@/components/points/ExtraParticipations';
import { Skeleton } from "@/components/ui/skeleton";

const PointsSystem = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['community-stats'],
    queryFn: async () => {
      // Get total participants count
      const { count: participantsCount } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true });

      // Get active contests count
      const { count: contestsCount } = await supabase
        .from('contests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get top score
      const { data: topScore } = await supabase
        .from('participants')
        .select('score')
        .order('score', { ascending: false })
        .limit(1)
        .single();

      return {
        totalParticipants: participantsCount || 0,
        totalContests: contestsCount || 0,
        topScore: topScore?.score || 0
      };
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent mb-4">
            Système de Points & Récompenses
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Participez, gagnez des points et débloquez des récompenses exclusives !
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        ) : (
          <CommunityStats
            totalParticipants={stats?.totalParticipants || 0}
            totalContests={stats?.totalContests || 0}
            topScore={stats?.topScore || 0}
          />
        )}

        <div className="space-y-8">
          <RanksList />
          <ExtraParticipations />
        </div>
      </div>
    </div>
  );
};

export default PointsSystem;