
import React from 'react';
import { RANK_POINTS } from '@/constants/ranks';

interface NextRankInfoProps {
  currentPoints: number;
  currentRank: string;
}

const NextRankInfo = ({ currentPoints, currentRank }: NextRankInfoProps) => {
  const getNextRankInfo = (points: number, rank: string) => {
    const ranks = Object.entries(RANK_POINTS).sort((a, b) => a[1] - b[1]);
    const nextRank = ranks.find(([_, rankPoints]) => rankPoints > points);
    if (nextRank) {
      return {
        rank: nextRank[0],
        pointsNeeded: nextRank[1] - points
      };
    }
    return null;
  };

  const nextRankInfo = getNextRankInfo(currentPoints, currentRank);

  if (!nextRankInfo) {
    return (
      <span className="text-sm text-emerald-600 font-medium">
        Rang maximal atteint !
      </span>
    );
  }

  return (
    <span className="text-sm text-gray-600">
      {nextRankInfo.pointsNeeded} points pour {nextRankInfo.rank}
    </span>
  );
};

export default NextRankInfo;
