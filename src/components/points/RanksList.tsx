import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import { RANKS } from "@/services/pointsService";

const RanksList = () => {
  return (
    <Card className="tropical-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <Award className="w-6 h-6 text-amber-500" />
          Rangs et Avantages
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {RANKS.map((rank) => (
            <div key={rank.rank} className="warm-gradient p-4 rounded-lg border border-amber-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold flex items-center gap-2 text-amber-800">
                  <span className="text-2xl">{rank.badge}</span>
                  {rank.rank}
                </h3>
                <span className="text-sm text-amber-700">
                  {rank.minPoints} - {rank.maxPoints === Infinity ? "∞" : rank.maxPoints} points
                </span>
              </div>
              <ul className="list-disc list-inside text-amber-800 space-y-1">
                {rank.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RanksList;