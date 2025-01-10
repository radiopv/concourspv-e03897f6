import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Star } from "lucide-react";
import { RANKS } from "@/types/points";

const RanksExplanation = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-6 h-6 text-purple-500" />
          Les Rangs Cubains et leurs Significations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {RANKS.map((rank) => (
            <div key={rank.rank} className="p-6 bg-white rounded-lg border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-3">
                  <span className="text-3xl">{rank.badge}</span>
                  <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                    {rank.rank}
                  </span>
                </h3>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <span>
                    {rank.minPoints} - {rank.maxPoints === Infinity ? "∞" : rank.maxPoints} points
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-gray-700 italic">
                    "{rank.description}"
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Avantages du rang :</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {rank.benefits.map((benefit, index) => (
                      <li key={index} className="pl-2">
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RanksExplanation;