import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";
import { Rank } from '@/types/points';
import { RANKS } from '@/services/pointsService';

interface ContestRankBadgeProps {
  requiredRank: Rank;
  userRank?: Rank;
}

const ContestRankBadge = ({ requiredRank, userRank }: ContestRankBadgeProps) => {
  const rank = RANKS.find(r => r.rank === requiredRank);
  const isLocked = !userRank || RANKS.findIndex(r => r.rank === userRank) < RANKS.findIndex(r => r.rank === requiredRank);

  return (
    <Badge 
      variant={isLocked ? "secondary" : "default"}
      className={`flex items-center gap-1 ${isLocked ? 'bg-gray-200 text-gray-600' : 'bg-green-500'}`}
    >
      {rank?.badge} {requiredRank}
      {isLocked && <Lock className="w-3 h-3 ml-1" />}
    </Badge>
  );
};

export default ContestRankBadge;