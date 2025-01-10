import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift } from "lucide-react";

const ExtraParticipations = () => {
  return (
    <Card className="tropical-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <Gift className="w-6 h-6 text-amber-500" />
          Participations Supplémentaires
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-amber-800 mb-4">
          Tous les 25 points cumulés, vous gagnez 2 participations supplémentaires aux concours !
        </p>
        <div className="warm-gradient p-4 rounded-lg border border-amber-100">
          <p className="text-sm text-amber-800">
            Exemple : avec 75 points, vous aurez gagné 6 participations supplémentaires.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExtraParticipations;