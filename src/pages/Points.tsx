import React from 'react';
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, Flame, Target, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { RANKS } from "@/services/pointsService";

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

        {/* Stats Cards */}
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

        {/* Points System */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Flame className="h-6 w-6 text-amber-500" />
              Système de Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PointCard
                title="Bonne Réponse"
                points="+1 point"
                description="Pour chaque bonne réponse"
              />
              <PointCard
                title="Série de 3"
                points="+5 points bonus"
                description="3 bonnes réponses consécutives"
              />
              <PointCard
                title="Série de 5"
                points="+10 points bonus"
                description="5 bonnes réponses consécutives"
              />
              <PointCard
                title="Série de 10"
                points="+25 points bonus"
                description="10 bonnes réponses consécutives"
              />
              <PointCard
                title="Série de 15"
                points="Points x2.5"
                description="15 bonnes réponses consécutives"
              />
              <PointCard
                title="Série de 20"
                points="Points x3"
                description="20 bonnes réponses consécutives"
              />
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-100 to-amber-50 rounded-lg">
              <div className="flex items-center gap-2 text-amber-800">
                <Award className="h-5 w-5" />
                <span className="font-semibold">Bonus Score Parfait :</span>
                <span>+200 points pour un score de 25/25 !</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ranks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Trophy className="h-6 w-6 text-amber-500" />
              Rangs et Avantages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {RANKS.map((rank, index) => (
                <motion.div
                  key={rank.rank}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/50 backdrop-blur-sm p-6 rounded-lg border border-amber-100 hover:shadow-lg transition-all"
                >
                  <div className="text-3xl mb-2">{rank.badge}</div>
                  <h3 className="font-bold text-lg text-amber-800 mb-1">{rank.rank}</h3>
                  <p className="text-amber-600 mb-3">{rank.minPoints} points minimum</p>
                  <ul className="space-y-2">
                    {rank.benefits.map((benefit, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                        <Star className="h-4 w-4 text-amber-400" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
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

const PointCard = ({ title, points, description }: {
  title: string;
  points: string;
  description: string;
}) => (
  <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg border border-amber-100">
    <h3 className="font-bold text-lg text-amber-800 mb-1">{title}</h3>
    <p className="text-xl font-semibold text-amber-600 mb-2">{points}</p>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

export default Points;