import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, Info, Gift } from "lucide-react";
import { motion } from "framer-motion";

const Instructions = () => {
  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent mb-4">
            Guide du Participant
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tout ce que vous devez savoir pour participer et gagner
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Trophy className="w-8 h-8 mx-auto text-amber-500 mb-2" />
              <CardTitle>Participation aux Concours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-600">
              <p>
                <strong>Important :</strong> Une seule tentative par concours est autorisée.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Lisez attentivement les articles avant de commencer</li>
                <li>Répondez à toutes les questions du quiz</li>
                <li>Score minimum requis : 80% pour être qualifié</li>
                <li>Les réponses se trouvent dans les articles fournis</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Star className="w-8 h-8 mx-auto text-amber-500 mb-2" />
              <CardTitle>Système de Points</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 text-gray-600">
                <li>
                  <strong>Points de base :</strong>
                  <br />1 point par bonne réponse
                </li>
                <li>
                  <strong>Bonus de série :</strong>
                  <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                    <li>3 bonnes réponses : +5 points</li>
                    <li>5 bonnes réponses : +10 points</li>
                    <li>10 bonnes réponses : +25 points</li>
                    <li>15 bonnes réponses : points x2.5</li>
                    <li>20 bonnes réponses : points x3</li>
                  </ul>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/50 backdrop-blur-sm mb-12">
          <CardHeader className="text-center">
            <Gift className="w-8 h-8 mx-auto text-amber-500 mb-2" />
            <CardTitle>Rangs et Avantages</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Rangs de Base</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>NOVATO (0-500 points) :</strong> Points de base</li>
                  <li><strong>HAVANA (501-1000 points) :</strong> +10% de points bonus</li>
                  <li><strong>SANTIAGO (1001-2000 points) :</strong> +25% de points bonus</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Rangs Avancés</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>RIO (2001-3500 points) :</strong> +50% de points bonus</li>
                  <li><strong>CARNIVAL (3501-5000 points) :</strong> Double points</li>
                  <li><strong>ELDORADO (5001+ points) :</strong> Triple points + accès VIP</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <Info className="w-8 h-8 mx-auto text-amber-500 mb-2" />
            <CardTitle>Conseils pour Réussir</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-600">
            <ul className="list-disc text-left max-w-lg mx-auto space-y-2">
              <li>Lisez attentivement chaque article avant de commencer</li>
              <li>Prenez des notes pendant votre lecture</li>
              <li>Maintenez votre série de bonnes réponses pour les bonus</li>
              <li>Participez régulièrement pour monter en rang</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Instructions;