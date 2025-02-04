import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, Info, Gift, Award, BookOpen } from "lucide-react";
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
              <BookOpen className="w-8 h-8 mx-auto text-amber-500 mb-2" />
              <CardTitle>Lecture des Articles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-600">
              <p>
                <strong>Important :</strong> Toutes les réponses aux questions se trouvent dans les articles fournis.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Prenez le temps de lire attentivement chaque article</li>
                <li>Les articles s'ouvrent dans une nouvelle fenêtre</li>
                <li>Vous pouvez relire les articles autant de fois que nécessaire</li>
                <li>Utilisez les articles comme référence pendant le questionnaire</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Trophy className="w-8 h-8 mx-auto text-amber-500 mb-2" />
              <CardTitle>Qualification et Tentatives</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-600">
              <p>
                <strong>Score minimum requis : 80%</strong> pour être qualifié au tirage au sort
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Vous disposez d'une seule tentative par questionnaire</li>
                <li>Répondez avec attention à chaque question</li>
                <li>Votre score final détermine votre qualification</li>
                <li>Les tentatives ne sont pas reportables</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Star className="w-8 h-8 mx-auto text-amber-500 mb-2" />
              <CardTitle>Système de Points</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 text-gray-600">
                <li>
                  <strong>Points de base :</strong>
                  <br />Chaque bonne réponse rapporte des points
                </li>
                <li>
                  <strong>Bonus de série :</strong>
                  <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                    <li>5 bonnes réponses : x1.5</li>
                    <li>10 bonnes réponses : x2</li>
                    <li>15 bonnes réponses : x2.5</li>
                    <li>20 bonnes réponses : x3</li>
                  </ul>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Gift className="w-8 h-8 mx-auto text-amber-500 mb-2" />
              <CardTitle>Récompenses et Rangs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-600">
              <p>
                Accumulez des points pour débloquer des avantages :
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>NOVATO (0-50 points) :</strong> Accès aux concours de base</li>
                <li><strong>HAVANA (51-150 points) :</strong> Bonus sur les points gagnés</li>
                <li><strong>SANTIAGO (151-300 points) :</strong> Accès prioritaire aux nouveaux concours</li>
                <li><strong>ELDORADO (1000+ points) :</strong> Statut VIP permanent</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/50 backdrop-blur-sm mb-12">
          <CardHeader className="text-center">
            <Info className="w-8 h-8 mx-auto text-amber-500 mb-2" />
            <CardTitle>Conseils pour Réussir</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-600">
            <div className="space-y-4">
              <p className="mb-4">
                Pour maximiser vos chances de qualification :
              </p>
              <ul className="list-disc text-left max-w-lg mx-auto space-y-2">
                <li>Lisez attentivement chaque article avant de commencer</li>
                <li>Prenez des notes pendant votre lecture</li>
                <li>Vérifiez vos réponses avant de les soumettre</li>
                <li>Prenez votre temps pour répondre aux questions</li>
                <li>N'hésitez pas à relire les articles en cas de doute</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Instructions;