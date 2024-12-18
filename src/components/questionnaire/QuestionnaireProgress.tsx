import React from 'react';
import { CardTitle } from "@/components/ui/card";

interface QuestionnaireProgressProps {
  currentQuestionIndex: number;
  totalQuestions: number;
}

const QuestionnaireProgress = ({ currentQuestionIndex, totalQuestions }: QuestionnaireProgressProps) => {
  const calculateProgress = () => {
    if (!totalQuestions) return 0;
    return Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <CardTitle className="text-2xl font-bold">
          Question {currentQuestionIndex + 1} sur {totalQuestions}
        </CardTitle>
        <span className="text-sm text-muted-foreground">
          {progress}% complété
        </span>
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