import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getUserPoints, getPointHistory } from "@/services/pointsService";
import { RANKS } from "@/types/points";
import RankCard from "./points/RankCard";
import StatsGrid from "./points/StatsGrid";
import PointHistory from "./points/PointHistory";

const PointsOverview = () => {
  const { user } = useAuth();

  const { data: points } = useQuery({
    queryKey: ['user-points', user?.id],
    queryFn: () => getUserPoints(user?.id!),
    enabled: !!user?.id
  });

  const { data: history } = useQuery({
    queryKey: ['points-history', user?.id],
    queryFn: () => getPointHistory(user?.id!),
    enabled: !!user?.id
  });

  if (!points) return null;

  const currentRankInfo = RANKS.find(r => r.rank === points.current_rank);
  const nextRankInfo = RANKS.find(r => r.minPoints > points.total_points);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            Vos Points et Récompenses
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <RankCard 
            currentRankInfo={currentRankInfo!}
            nextRankInfo={nextRankInfo}
            totalPoints={points.total_points}
          />
          <StatsGrid 
            totalPoints={points.total_points}
            bestStreak={points.best_streak}
            extraParticipations={points.extra_participations}
          />
        </CardContent>
      </Card>

      {history && <PointHistory history={history} />}
    </div>
  );
};

export default PointsOverview;