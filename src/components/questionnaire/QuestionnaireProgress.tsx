import React from 'react';
import { CardTitle } from "@/components/ui/card";

interface QuestionnaireProgressProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  score: number;
  totalAnswered: number;
}

const QuestionnaireProgress = ({ 
  currentQuestionIndex, 
  totalQuestions,
  score,
  totalAnswered
}: QuestionnaireProgressProps) => {
  const calculateProgress = () => {
    if (!totalQuestions) return 0;
    return Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);
  };

  const progress = calculateProgress();
  const currentScore = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <CardTitle className="text-2xl font-bold">
          Question {currentQuestionIndex + 1} sur {totalQuestions}
        </CardTitle>
        <div className="text-sm space-y-1">
          <div className="text-muted-foreground">
            {progress}% complété
          </div>
          <div className="text-primary font-medium">
            Score actuel: {currentScore}%
          </div>
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