import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Star, Award } from "lucide-react";

interface CommunityStatsProps {
  stats: {
    totalUsers: number;
    averagePoints: number;
    mostCommonRank: string;
  };
}

const CommunityStats: React.FC<CommunityStatsProps> = ({ stats }) => {
  return (
    <Card className="tropical-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <Users className="w-6 h-6 text-amber-500" />
          Statistiques de la communauté
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <div className="warm-gradient p-4 rounded-lg border border-amber-100">
          <h3 className="font-semibold mb-2 flex items-center gap-2 text-amber-800">
            <Users className="w-5 h-5 text-amber-500" />
            Membres actifs
          </h3>
          <p className="text-2xl font-bold text-amber-900">{stats.totalUsers}</p>
        </div>
        <div className="warm-gradient p-4 rounded-lg border border-amber-100">
          <h3 className="font-semibold mb-2 flex items-center gap-2 text-amber-800">
            <Star className="w-5 h-5 text-amber-500" />
            Points moyens
          </h3>
          <p className="text-2xl font-bold text-amber-900">{Math.round(stats.averagePoints)}</p>
        </div>
        <div className="warm-gradient p-4 rounded-lg border border-amber-100">
          <h3 className="font-semibold mb-2 flex items-center gap-2 text-amber-800">
            <Award className="w-5 h-5 text-amber-500" />
            Rang le plus commun
          </h3>
          <p className="text-2xl font-bold text-amber-900">{stats.mostCommonRank}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityStats;