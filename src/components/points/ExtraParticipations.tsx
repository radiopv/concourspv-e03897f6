import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift } from "lucide-react";

const ExtraParticipations = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-6 h-6 text-pink-500" />
          Participations Supplémentaires
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          Tous les 25 points cumulés, vous gagnez 2 participations supplémentaires aux concours !
        </p>
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="text-sm text-indigo-600">
            Exemple : avec 75 points, vous aurez gagné 6 participations supplémentaires.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExtraParticipations;