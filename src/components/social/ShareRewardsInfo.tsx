import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, Award, Star } from "lucide-react";

const ShareRewardsInfo = () => {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-600">
          <Share2 className="w-5 h-5" />
          Récompenses de partage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Share2 className="w-4 h-4" />
              <h3 className="font-medium">Partage de concours</h3>
            </div>
            <p className="text-sm text-gray-600">
              +5 points et 1 participation bonus
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-purple-600 mb-2">
              <Star className="w-4 h-4" />
              <h3 className="font-medium">Partage de score</h3>
            </div>
            <p className="text-sm text-gray-600">
              +5 points
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-amber-600 mb-2">
              <Award className="w-4 h-4" />
              <h3 className="font-medium">Bonus mensuel</h3>
            </div>
            <p className="text-sm text-gray-600">
              +15 points pour 5 partages
            </p>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 text-center mt-4">
          Partagez pour gagner des points et des participations bonus !
        </p>
      </CardContent>
    </Card>
  );
};

export default ShareRewardsInfo;