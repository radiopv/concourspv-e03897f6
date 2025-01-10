import React from 'react';
import { Star, TrendingUp, Trophy } from "lucide-react";

interface StatsGridProps {
  totalPoints: number;
  bestStreak: number;
  extraParticipations: number;
}

const StatsGrid = ({ totalPoints, bestStreak, extraParticipations }: StatsGridProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-5 h-5 text-purple-500" />
          <h3 className="font-semibold">Total des points</h3>
        </div>
        <p className="text-2xl font-bold">{totalPoints}</p>
      </div>

      <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <h3 className="font-semibold">Meilleure série</h3>
        </div>
        <p className="text-2xl font-bold">{bestStreak}</p>
      </div>

      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold">Participations bonus</h3>
        </div>
        <p className="text-2xl font-bold">{extraParticipations}</p>
      </div>
    </div>
  );
};

export default StatsGrid;