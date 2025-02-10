
import { Users, Star, Trophy } from "lucide-react";

interface ParticipationStatsProps {
  participantsCount: number;
  eligibleCount: number;
  averageScore: number;
}

const ParticipationStats = ({ participantsCount, eligibleCount, averageScore }: ParticipationStatsProps) => {
  console.log('ParticipationStats received:', {
    participantsCount,
    eligibleCount,
    averageScore
  });
  
  // Assurons-nous que nous n'affichons que des nombres valides
  const displayCount = Math.max(0, participantsCount);
  const displayEligible = Math.max(0, eligibleCount);
  const displayScore = Math.max(0, Math.min(100, averageScore));

  return (
    <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-6">
      <div className="bg-white/50 p-4 rounded-lg">
        <p className="font-medium flex items-center gap-1 mb-1">
          <Users className="w-4 h-4 text-indigo-600" />
          Participants
        </p>
        <p className="text-2xl font-bold text-indigo-600">
          {displayCount}
        </p>
      </div>
      
      <div className="bg-white/50 p-4 rounded-lg">
        <p className="font-medium flex items-center gap-1 mb-1">
          <Star className="w-4 h-4 text-orange-600" />
          Score Moyen
        </p>
        <p className="text-2xl font-bold text-orange-600">
          {displayScore}%
        </p>
      </div>

      <div className="bg-white/50 p-4 rounded-lg">
        <p className="font-medium flex items-center gap-1 mb-1">
          <Trophy className="w-4 h-4 text-green-600" />
          Éligibles
        </p>
        <p className="text-2xl font-bold text-green-600">
          {displayEligible}
        </p>
      </div>
    </div>
  );
};

export default ParticipationStats;
