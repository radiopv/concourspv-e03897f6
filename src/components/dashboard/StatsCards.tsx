import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Trophy } from "lucide-react";
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface StatsCardsProps {
  stats: {
    contests_participated?: number;
    total_points?: number;
    contests_won?: number;
  } | null;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  const { data: realStats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error('User not authenticated');

      // Fetch member stats
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .select('contests_participated, contests_won')
        .eq('id', session.user.id)
        .single();

      if (memberError) throw memberError;

      return {
        contests_participated: memberData?.contests_participated || 0,
        contests_won: memberData?.contests_won || 0,
      };
    }
  });

  const participations = realStats?.contests_participated || 0;
  const wins = realStats?.contests_won || 0;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <motion.div
        custom={0}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="glass-card hover:shadow-lg transition-all duration-300">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2 text-amber-700">
              <Target className="h-6 w-6 text-amber-500" />
              Participations
            </CardTitle>
            <CardDescription>Total des concours participés</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-600">{participations}</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        custom={1}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="glass-card hover:shadow-lg transition-all duration-300">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2 text-amber-700">
              <Trophy className="h-6 w-6 text-amber-500" />
              Victoires
            </CardTitle>
            <CardDescription>Concours gagnés</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-600">{wins}</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default StatsCards;