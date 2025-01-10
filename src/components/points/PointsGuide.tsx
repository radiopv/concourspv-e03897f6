import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, TrendingUp } from "lucide-react";

const PointsGuide = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" />
          Comment gagner des points
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 bg-white rounded-lg border">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Points de base
            </h3>
            <p className="text-gray-600">1 point par bonne réponse</p>
          </div>
          <div className="p-4 bg-white rounded-lg border">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Points bonus
            </h3>
            <p className="text-gray-600">5 points bonus pour 10 bonnes réponses consécutives</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsGuide;