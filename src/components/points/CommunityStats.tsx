import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Star, Award } from "lucide-react";

interface CommunityStatsProps {
  totalUsers: number;
  averagePoints: number;
  mostCommonRank: string;
}

const CommunityStats = ({ totalUsers, averagePoints, mostCommonRank }: CommunityStatsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-500" />
          Statistiques de la communauté
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <div className="p-4 bg-white rounded-lg border">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Membres actifs
          </h3>
          <p className="text-2xl font-bold">{totalUsers}</p>
        </div>
        <div className="p-4 bg-white rounded-lg border">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Points moyens
          </h3>
          <p className="text-2xl font-bold">{Math.round(averagePoints)}</p>
        </div>
        <div className="p-4 bg-white rounded-lg border">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-500" />
            Rang le plus commun
          </h3>
          <p className="text-2xl font-bold">{mostCommonRank}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityStats;