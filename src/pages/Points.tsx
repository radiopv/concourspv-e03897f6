import React from 'react';
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Star, Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import UserRankProgress from '@/components/points/UserRankProgress';
import RanksList from '@/components/points/RanksList';

const Points = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['community-stats'],
    queryFn: async () => {
      const { count: participantsCount } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true });

      const { count: contestsCount } = await supabase
        .from('contests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      const { data: topScore } = await supabase
        .from('user_points')
        .select('total_points')
        .order('total_points', { ascending: false })
        .limit(1)
        .single();

      return {
        totalParticipants: participantsCount || 0,
        totalContests: contestsCount || 0,
        topScore: topScore?.total_points || 0
      };
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-8 px-4 md:py-12">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent mb-4">
            Système de Points & Récompenses
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Participez, enchaînez les bonnes réponses et gagnez des points bonus !
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatsCard
              icon={Trophy}
              title="Meilleur Score"
              value={stats?.topScore || 0}
              color="text-amber-500"
            />
            <StatsCard
              icon={Target}
              title="Participants"
              value={stats?.totalParticipants || 0}
              color="text-blue-500"
            />
            <StatsCard
              icon={Star}
              title="Concours Actifs"
              value={stats?.totalContests || 0}
              color="text-purple-500"
            />
          </div>
        )}

        <div className="space-y-8">
          <UserRankProgress />
          <RanksList />
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ icon: Icon, title, value, color }: {
  icon: any;
  title: string;
  value: number;
  color: string;
}) => (
  <Card className="relative overflow-hidden">
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value.toLocaleString()}</p>
        </div>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
    </CardContent>
  </Card>
);

export default Points;