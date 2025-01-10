import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, MapPin, Gift, Info, Award } from "lucide-react";
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
              <CardTitle>Système de Points</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                <strong>Points de base :</strong> Chaque bonne réponse vous rapporte des points.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Première tentative réussie : 1 point</li>
                <li>Bonus de série de 5 bonnes réponses : x1.5</li>
                <li>Bonus de série de 10 bonnes réponses : x2</li>
                <li>Bonus de série de 15 bonnes réponses : x2.5</li>
                <li>Bonus de série de 20 bonnes réponses : x3</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Star className="w-8 h-8 mx-auto text-amber-500 mb-2" />
              <CardTitle>Rangs et Avantages</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 text-gray-600">
                <li>
                  <strong>NOVATO (0-50 points) :</strong>
                  <br />Accès aux concours de base
                </li>
                <li>
                  <strong>HAVANA (51-150 points) :</strong>
                  <br />2 participations bonus par concours
                </li>
                <li>
                  <strong>SANTIAGO (151-300 points) :</strong>
                  <br />3 participations bonus et accès prioritaire
                </li>
                <li>
                  <strong>ELDORADO (1000+ points) :</strong>
                  <br />Statut VIP et avantages exclusifs
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Info className="w-8 h-8 mx-auto text-amber-500 mb-2" />
              <CardTitle>Fonctionnement du Questionnaire</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-600">
              <ul className="list-disc list-inside space-y-2">
                <li>Lisez attentivement chaque question</li>
                <li>Vous avez 3 tentatives maximum par questionnaire</li>
                <li>Les réponses sont enregistrées automatiquement</li>
                <li>Vous pouvez faire une pause et reprendre plus tard</li>
                <li>Les articles liés aux questions sont disponibles pour référence</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Gift className="w-8 h-8 mx-auto text-amber-500 mb-2" />
              <CardTitle>Prix et Récompenses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-600">
              <p>
                Les gagnants peuvent choisir entre deux prix de valeur équivalente.
                Les prix sont soigneusement sélectionnés pour leur qualité et leur utilité.
              </p>
              <p>
                <strong>Important :</strong> Les gagnants seront contactés par email
                et auront 7 jours pour choisir leur prix.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/50 backdrop-blur-sm mb-12">
          <CardHeader className="text-center">
            <MapPin className="w-8 h-8 mx-auto text-amber-500 mb-2" />
            <CardTitle>Éligibilité</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-600">
            <p className="mb-4">
              Le concours est exclusivement réservé aux résidents canadiens des provinces suivantes :
            </p>
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <Award className="w-6 h-6 mx-auto text-amber-500 mb-2" />
                <p className="font-semibold">Ontario</p>
              </div>
              <div className="text-center">
                <Award className="w-6 h-6 mx-auto text-amber-500 mb-2" />
                <p className="font-semibold">Nouveau-Brunswick</p>
              </div>
            </div>
            <p className="mt-4 text-sm">
              Une preuve de résidence pourra être demandée lors de la réclamation des prix.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Instructions;