import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Trophy, Diamond, Coins, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import QuestionnaireComponent from "@/components/QuestionnaireComponent";
import ContestCard from "@/components/contests/ContestCard";
import { useContests } from "@/hooks/useContests";
import { RANKS } from "@/services/pointsService";

const ContestsList = () => {
  const navigate = useNavigate();
  const [selectedContestId, setSelectedContestId] = useState<string | null>(null);
  const { data: contests, isLoading } = useContests();

  if (selectedContestId) {
    return <QuestionnaireComponent contestId={selectedContestId} />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!contests || contests.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-lg w-full glass-card">
          <CardContent className="text-center py-12">
            <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-6 animate-bounce" />
            <h2 className="text-2xl font-semibold mb-4">
              Aucun concours n'est actuellement disponible
            </h2>
            <p className="text-gray-600 mb-6">
              Revenez plus tard pour découvrir nos nouveaux concours !
            </p>
            <Button onClick={() => navigate("/")} variant="outline">
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-amber-500 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-purple-600 bg-clip-text text-transparent">
              Nos Concours
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez nos concours exceptionnels et leurs lots incroyables à gagner !
          </p>
        </motion.div>

        {/* Nouvelle section Points System */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <Card className="glass-card overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Diamond className="w-8 h-8 text-purple-500 animate-pulse" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Système de Points & Récompenses
                </h2>
                <Diamond className="w-8 h-8 text-purple-500 animate-pulse" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg shadow-md"
                >
                  <Coins className="w-8 h-8 text-amber-500 mb-2" />
                  <h3 className="font-bold text-lg mb-2">Points de Base</h3>
                  <p className="text-gray-600">
                    Gagnez des points à chaque bonne réponse et débloquez des récompenses exclusives !
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow-md"
                >
                  <Star className="w-8 h-8 text-blue-500 mb-2" />
                  <h3 className="font-bold text-lg mb-2">Bonus de Lecture</h3>
                  <p className="text-gray-600">
                    +2 points par article lu et bonus de 15 points tous les 10 articles !
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg shadow-md"
                >
                  <Sparkles className="w-8 h-8 text-green-500 mb-2" />
                  <h3 className="font-bold text-lg mb-2">Bonus de Série</h3>
                  <p className="text-gray-600">
                    Multipliez vos gains avec des séries de bonnes réponses !
                  </p>
                </motion.div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 text-center">Niveaux & Avantages</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {RANKS.map((rank, index) => (
                    <motion.div
                      key={rank.rank}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm"
                    >
                      <div className="text-2xl mb-1">{rank.badge}</div>
                      <div className="font-bold text-sm">{rank.rank}</div>
                      <div className="text-xs text-gray-500">
                        {rank.minPoints} pts
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest, index) => (
            <ContestCard
              key={contest.id}
              contest={contest}
              onSelect={setSelectedContestId}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContestsList;