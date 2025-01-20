import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Trophy, Star } from "lucide-react";

interface CommunityStatsProps {
  totalParticipants: number;
  totalContests: number;
  topScore: number;
}

const CommunityStats: React.FC<CommunityStatsProps> = ({
  totalParticipants,
  totalContests,
  topScore
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-amber-50 to-red-50 border-amber-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-amber-700 font-medium text-sm">
            Participants
          </CardTitle>
          <Users className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-900">{totalParticipants}</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-amber-50 to-red-50 border-amber-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-amber-700 font-medium text-sm">
            Concours Actifs
          </CardTitle>
          <Trophy className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-900">{totalContests}</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-amber-50 to-red-50 border-amber-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-amber-700 font-medium text-sm">
            Meilleur Score
          </CardTitle>
          <Star className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-900">{topScore}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityStats;