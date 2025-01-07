import { Users, Trophy } from "lucide-react";

interface ParticipationStatsProps {
  participantsCount: number;
}

const ParticipationStats = ({ participantsCount }: ParticipationStatsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
      <div className="bg-white/50 p-4 rounded-lg">
        <p className="font-medium flex items-center gap-1 mb-1">
          <Users className="w-4 h-4 text-indigo-600" />
          Participants
        </p>
        <p className="text-2xl font-bold text-indigo-600">
          {participantsCount}
        </p>
      </div>
      <div className="bg-white/50 p-4 rounded-lg">
        <p className="font-medium flex items-center gap-1 mb-1">
          <Trophy className="w-4 h-4 text-amber-600" />
          Lots à gagner
        </p>
        <p className="text-lg font-medium text-amber-600">
          Tentez votre chance !
        </p>
      </div>
    </div>
  );
};

export default ParticipationStats;