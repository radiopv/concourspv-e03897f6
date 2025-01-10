import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, BookOpen, Trophy } from "lucide-react";

const ExtraParticipations = () => {
  return (
    <Card className="bg-gradient-to-br from-amber-50 to-red-50 border-amber-200">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
          Participations Bonus
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg">
            <Star className="h-8 w-8 text-amber-500 mb-4" />
            <h3 className="font-bold text-lg mb-2 text-amber-800">Points de Base</h3>
            <p className="text-gray-600">
              Gagnez des points à chaque bonne réponse et débloquez des récompenses exclusives !
            </p>
          </div>

          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg">
            <BookOpen className="h-8 w-8 text-amber-500 mb-4" />
            <h3 className="font-bold text-lg mb-2 text-amber-800">Bonus de Lecture</h3>
            <p className="text-gray-600">
              +2 points par article lu et bonus de 15 points tous les 10 articles !
            </p>
          </div>

          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg">
            <Trophy className="h-8 w-8 text-amber-500 mb-4" />
            <h3 className="font-bold text-lg mb-2 text-amber-800">Bonus de Série</h3>
            <p className="text-gray-600">
              Multipliez vos gains avec des séries de bonnes réponses !
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExtraParticipations;