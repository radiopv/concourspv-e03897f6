import { Users, Trophy, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CommunityStatsProps {
  totalParticipants: number;
  totalContests: number;
  topScore: number;
}

const CommunityStats = ({ totalParticipants, totalContests, topScore }: CommunityStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <Users className="h-8 w-8 text-indigo-600 mb-2" />
            <h3 className="text-lg font-semibold text-gray-900">Participants</h3>
            <p className="text-3xl font-bold text-indigo-600">{totalParticipants}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <Trophy className="h-8 w-8 text-amber-600 mb-2" />
            <h3 className="text-lg font-semibold text-gray-900">Meilleur Score</h3>
            <p className="text-3xl font-bold text-amber-600">{topScore}%</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <Calendar className="h-8 w-8 text-green-600 mb-2" />
            <h3 className="text-lg font-semibold text-gray-900">Concours Actifs</h3>
            <p className="text-3xl font-bold text-green-600">{totalContests}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityStats;