import { Users, Percent } from "lucide-react";
import { calculateWinningChance } from "../../../utils/contestCalculations";

interface ParticipationStatsProps {
  participantsCount: number;
}

const ParticipationStats = ({ participantsCount }: ParticipationStatsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
      <div className="bg-white/50 p-4 rounded-lg">
        <p className="font-medium flex items-center gap-1 mb-1">
          <Users className="w-4 h-4 text-indigo-600" />
          Participants éligibles
        </p>
        <p className="text-2xl font-bold text-indigo-600">
          {participantsCount}
        </p>
      </div>
      <div className="bg-white/50 p-4 rounded-lg">
        <p className="font-medium flex items-center gap-1 mb-1">
          <Percent className="w-4 h-4 text-green-600" />
          Chances de gagner
        </p>
        <p className="text-2xl font-bold text-green-600">
          {calculateWinningChance(participantsCount)}%
        </p>
      </div>
    </div>
  );
};

export default ParticipationStats;