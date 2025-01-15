import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RANKS } from "@/services/pointsService";
import { motion } from "framer-motion";

const RanksList = () => {
  return (
    <Card className="bg-gradient-to-br from-amber-50 to-red-50 border-amber-200">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
          Niveaux & Avantages
        </CardTitle>
        <p className="text-gray-600 mt-2">
          Découvrez nos niveaux inspirés de la culture latino-américaine. Chaque rang représente une étape de votre voyage à travers le continent !
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RANKS.map((rank, index) => (
            <motion.div
              key={rank.rank}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/50 backdrop-blur-sm p-6 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{rank.badge}</span>
                <div>
                  <h3 className="font-bold text-lg text-amber-800">{rank.rank}</h3>
                  <p className="text-sm text-amber-600">
                    {rank.minPoints} - {rank.maxPoints === Infinity ? "∞" : rank.maxPoints} points
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 italic">
                  {getRankDescription(rank.rank)}
                </p>
                <div className="border-t border-amber-100 pt-4">
                  <h4 className="font-semibold text-amber-700 mb-2">Avantages :</h4>
                  <ul className="space-y-2 text-gray-700">
                    {rank.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-500">•</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const getRankDescription = (rank: string): string => {
  switch (rank) {
    case 'NOVATO':
      return "Signifiant 'débutant' en espagnol, c'est le point de départ de votre aventure latino-américaine. Comme un voyageur découvrant ses premiers pas dans un nouveau monde.";
    case 'HAVANA':
      return "Inspiré de la capitale cubaine, ce rang représente votre première immersion dans la culture latine, comme une soirée de salsa dans les rues de La Havane.";
    case 'SANTIAGO':
      return "Nommé d'après plusieurs villes importantes d'Amérique latine, ce niveau symbolise votre progression et votre maîtrise grandissante, tel un danseur expérimenté.";
    case 'RIO':
      return "Évoquant la ville vibrante de Rio de Janeiro, ce rang représente votre esprit festif et votre engagement dans la communauté, comme pendant le carnaval.";
    case 'CARNIVAL':
      return "Inspiré des célèbres carnavals latino-américains, ce niveau célèbre votre expertise et votre contribution exceptionnelle à la communauté.";
    case 'ELDORADO':
      return "Comme la légendaire cité d'or, ce rang ultime représente l'excellence et la maîtrise absolue. Vous êtes devenu une légende vivante de notre communauté !";
    default:
      return "";
  }
};

export default RanksList;