import React from 'react';
import { CardTitle } from "@/components/ui/card";
import { Trophy, Star } from "lucide-react";
import { calculatePointsAndAttempts } from "../../utils/pointsCalculator";

interface QuestionnaireProgressProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  score: number;
  totalAnswered: number;
  correctAnswers: number;
}

const QuestionnaireProgress = ({ 
  currentQuestionIndex, 
  totalQuestions,
  score,
  totalAnswered,
  correctAnswers
}: QuestionnaireProgressProps) => {
  const calculateProgress = () => {
    if (!totalQuestions) return 0;
    return Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);
  };

  const progress = calculateProgress();
  const currentScore = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;
  const { points, bonusAttempts, nextMilestone } = calculatePointsAndAttempts(correctAnswers);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <CardTitle className="text-2xl font-bold">
          Question {currentQuestionIndex + 1} sur {totalQuestions}
        </CardTitle>
        <div className="text-sm space-y-2">
          <div className="text-muted-foreground">
            {progress}% complété
          </div>
          <div className="text-primary font-medium flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Score actuel: {currentScore}%
          </div>
          <div className="text-amber-600 font-medium flex items-center gap-2">
            <Star className="w-4 h-4" />
            Points: {points}
            {bonusAttempts > 0 && (
              <span className="text-green-600 text-xs">
                (+{bonusAttempts} participations bonus)
              </span>
            )}
          </div>
          {nextMilestone && (
            <div className="text-xs text-gray-500">
              Prochain palier: {nextMilestone.points} points 
              (+{nextMilestone.attemptsToUnlock} participations)
            </div>
          )}
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default QuestionnaireProgress;