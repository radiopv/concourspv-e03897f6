
import React from 'react';
import { Trophy, Medal, Award, Crown } from 'lucide-react';

interface UserRankProps {
  position: number;
}

const UserRank = ({ position }: UserRankProps) => {
  const getRankIcon = (pos: number) => {
    switch (pos) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-700" />;
      default:
        return <Award className="h-6 w-6 text-blue-500" />;
    }
  };

  return (
    <div className="flex items-center gap-2">
      {getRankIcon(position)}
      {position}
    </div>
  );
};

export default UserRank;
