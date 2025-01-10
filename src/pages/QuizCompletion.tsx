import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Target, ArrowRight, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from 'react-helmet';

const QuizCompletion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, totalQuestions, contestId, requiredPercentage = 90 } = location.state || { 
    score: 0, 
    totalQuestions: 0,
    contestId: null,
    requiredPercentage: 90
  };

  // S'assurer que le score est un nombre
  const numericScore = typeof score === 'number' ? score : 0;
  const numericTotalQuestions = typeof totalQuestions === 'number' ? totalQuestions : 0;
  
  // Calculer le nombre de bonnes réponses
  const correctAnswers = Math.round((numericScore / 100) * numericTotalQuestions);
  
  const isQualified = numericScore >= requiredPercentage;

  const handleRetry = () => {
    if (!contestId) {
      console.error("Contest ID is missing");
      navigate('/contests');
      return;
    }
    navigate(`/contest/${contestId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Helmet>
        <title>{isQualified ? "Félicitations !" : "Quiz terminé"}</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-amber-600 mb-4">
          {isQualified ? "🎉 Félicitations !" : "Quiz terminé"}
        </h1>
        <p className="text-xl text-gray-600">
          {isQualified 
            ? "Vous êtes qualifié pour le tirage au sort !"
            : `Le score minimum requis est de ${requiredPercentage}%. N'hésitez pas à réessayer !`}
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50">
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Score Final
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-600">{numericScore}%</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-purple-500" />
                Bonnes Réponses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">
                {correctAnswers}/{numericTotalQuestions}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                Statut
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {isQualified ? "Qualifié" : "Non qualifié"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center space-y-4"
      >
        <p className="text-lg text-gray-600">
          {isQualified 
            ? "Bravo ! Vous êtes qualifié pour le tirage au sort !"
            : `Le score minimum requis est de ${requiredPercentage}%. N'hésitez pas à réessayer !`}
        </p>
        <div className="space-x-4">
          {!isQualified && (
            <Button
              onClick={handleRetry}
              className="bg-amber-500 hover:bg-amber-600"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Réessayer le quiz
            </Button>
          )}
          <Button
            onClick={() => navigate('/contests')}
            className="bg-amber-500 hover:bg-amber-600"
          >
            Voir tous les concours
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizCompletion;