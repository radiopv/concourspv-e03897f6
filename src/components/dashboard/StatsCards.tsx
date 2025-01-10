import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Star, Trophy } from "lucide-react";
import { motion } from 'framer-motion';

interface StatsCardsProps {
  stats: {
    contests_participated?: number;
    total_points?: number;
    contests_won?: number;
  } | null;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  const participations = stats?.contests_participated || 0;
  const points = stats?.total_points || 0;
  const wins = stats?.contests_won || 0;

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              <Star className="h-6 w-6 text-amber-500" />
              Points
            </CardTitle>
            <CardDescription>Points accumulés</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-600">{Math.round(points)}</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        custom={2}
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