import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { getUserPoints } from "@/services/pointsService";
import { RANKS } from "@/services/pointsService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const UserRankProgress = () => {
  const { toast } = useToast();
  const { data: userPoints, isLoading } = useQuery({
    queryKey: ['user-points'],
    queryFn: async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user?.id) return null;
        return getUserPoints(session.session.user.id);
      } catch (error) {
        console.error('Error fetching user points:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos points",
          variant: "destructive",
        });
        return null;
      }
    }
  });

  if (isLoading || !userPoints) {
    return (
      <Card className="bg-gradient-to-br from-amber-50 to-red-50 border-amber-200">
        <CardContent className="p-6">
          <div className="h-24 animate-pulse bg-amber-100/50 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  const currentRank = RANKS.find(
    rank => userPoints.total_points >= rank.minPoints && 
           userPoints.total_points <= rank.maxPoints
  );

  const nextRank = RANKS.find(
    rank => rank.minPoints > userPoints.total_points
  );

  const calculateProgress = () => {
    if (!currentRank || !nextRank) return 100;
    const totalPointsNeeded = nextRank.minPoints - currentRank.minPoints;
    const pointsGained = userPoints.total_points - currentRank.minPoints;
    return Math.round((pointsGained / totalPointsNeeded) * 100);
  };

  const pointsToNextRank = nextRank 
    ? nextRank.minPoints - userPoints.total_points 
    : 0;

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-red-50 border-amber-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Trophy className="h-6 w-6 text-amber-500" />
          Votre Progression
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="text-4xl">{currentRank?.badge}</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-amber-800">
              {currentRank?.rank}
            </h3>
            <p className="text-amber-600">
              {userPoints.total_points} points
            </p>
          </div>
        </motion.div>

        {nextRank && (
          <>
            <div className="relative pt-4">
              <Progress value={calculateProgress()} className="h-2" />
              <div className="flex justify-between mt-2 text-sm text-amber-600">
                <span>{currentRank?.rank}</span>
                <span>{nextRank?.rank}</span>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-amber-700 bg-amber-100/50 p-4 rounded-lg"
            >
              <Star className="h-5 w-5 text-amber-500" />
              <span>Plus que {pointsToNextRank} points pour devenir</span>
              <span className="font-bold">{nextRank.rank}</span>
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </>
        )}

        <div className="text-sm text-amber-700">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            <span>Meilleure série : {userPoints.best_streak} réponses correctes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserRankProgress;