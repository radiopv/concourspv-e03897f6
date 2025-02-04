import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from 'react-helmet';
import { ScoreCard } from '@/components/quiz-completion/ScoreCard';
import { AnswersCard } from '@/components/quiz-completion/AnswersCard';
import { StatusCard } from '@/components/quiz-completion/StatusCard';
import { isQualifiedForDraw } from '@/utils/scoreCalculations';
import ShareScore from '@/components/quiz-completion/ShareScore';

const QuizCompletion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { 
    score = 0, 
    totalQuestions = 0, 
    contestId, 
    requiredPercentage = 80 
  } = location.state || {};

  const correctAnswers = Math.round((score / 100) * totalQuestions);
  const isQualified = isQualifiedForDraw(score, requiredPercentage);

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
          Voici vos résultats
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ScoreCard score={score} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AnswersCard correctAnswers={correctAnswers} totalQuestions={totalQuestions} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatusCard isQualified={isQualified} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center space-y-4"
      >
        <p className="text-lg text-gray-600 mb-4">
          {isQualified 
            ? "Bravo ! Vous êtes qualifié pour le tirage au sort !"
            : `Le score minimum requis est de ${requiredPercentage}%. Une seule participation est autorisée par concours.`}
        </p>
        <div className="space-x-4">
          <Button
            onClick={() => navigate('/contests')}
            className="bg-amber-500 hover:bg-amber-600"
          >
            Voir tous les concours
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        {isQualified && contestId && (
          <div className="mt-8">
            <ShareScore 
              score={score} 
              totalQuestions={totalQuestions} 
              contestId={contestId} 
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default QuizCompletion;