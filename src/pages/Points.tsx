import React from 'react';
import PointsOverview from '@/components/dashboard/PointsOverview';
import RanksList from '@/components/points/RanksList';
import ExtraParticipations from '@/components/points/ExtraParticipations';
import CommunityStats from '@/components/points/CommunityStats';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const Points = () => {
  const { data: stats } = useQuery({
    queryKey: ['community-stats'],
    queryFn: async () => {
      // Récupérer le nombre total de participants
      const { count: participantsCount } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true });

      // Récupérer le nombre de concours actifs
      const { count: contestsCount } = await supabase
        .from('contests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Récupérer le meilleur score
      const { data: topScore } = await supabase
        .from('participants')
        .select('score')
        .order('score', { ascending: false })
        .limit(1)
        .maybeSingle();

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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent mb-4">
            Système de Points & Récompenses
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Participez, gagnez des points et débloquez des récompenses exclusives !
          </p>
        </div>

        <CommunityStats
          totalParticipants={stats?.totalParticipants || 0}
          totalContests={stats?.totalContests || 0}
          topScore={stats?.topScore || 0}
        />

        <div className="space-y-8">
          <PointsOverview />
          <RanksList />
          <ExtraParticipations />
        </div>
      </div>
    </div>
  );
};

export default Points;