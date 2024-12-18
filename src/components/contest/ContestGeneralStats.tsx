import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Users } from "lucide-react";

interface ContestGeneralStatsProps {
  averageScore: number;
  qualifiedCount: number;
  totalParticipants: number;
}

const ContestGeneralStats = ({ 
  averageScore, 
  qualifiedCount, 
  totalParticipants 
}: ContestGeneralStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" />
            Score moyen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-center text-yellow-600">
            {averageScore}%
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6 text-green-500" />
            Participants qualifiés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-center text-green-600">
            {qualifiedCount} / {totalParticipants}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContestGeneralStats;