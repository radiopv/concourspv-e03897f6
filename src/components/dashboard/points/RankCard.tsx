import React from 'react';
import { Award } from "lucide-react";
import { UserRank } from "@/types/points";

interface RankCardProps {
  currentRankInfo: UserRank;
  nextRankInfo?: UserRank;
  totalPoints: number;
}

const RankCard = ({ currentRankInfo, nextRankInfo, totalPoints }: RankCardProps) => {
  return (
    <div className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-6 h-6 text-amber-500" />
        <h3 className="text-lg font-semibold">Rang actuel</h3>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{currentRankInfo?.badge}</span>
        <span className="text-2xl font-medium">{currentRankInfo?.rank}</span>
      </div>
      <p className="text-gray-600">{currentRankInfo?.description}</p>
      {nextRankInfo && (
        <div className="mt-4 p-4 bg-white/50 rounded-lg">
          <p className="text-sm text-gray-600">
            Prochain rang : {nextRankInfo.rank} ({nextRankInfo.badge})
          </p>
          <p className="text-sm text-gray-600">
            Points nécessaires : {nextRankInfo.minPoints - totalPoints} points
          </p>
        </div>
      )}
    </div>
  );
};

export default RankCard;