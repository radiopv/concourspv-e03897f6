import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionnaireProgressProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  score: number;
  totalAnswered: number;
}

const QuestionnaireProgress = ({
  currentQuestionIndex,
  totalQuestions,
}: QuestionnaireProgressProps) => {
  const displayQuestionNumber = Math.min(currentQuestionIndex, totalQuestions);
  const progressPercentage = (displayQuestionNumber / totalQuestions) * 100;
  const isNearingCompletion = progressPercentage > 75;

  return (
    <div className="space-y-4 animate-fade-in">      
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Question {displayQuestionNumber} sur {totalQuestions}</span>
        </div>
        
        <Progress 
          value={progressPercentage} 
          className={cn(
            "transition-all duration-500",
            isNearingCompletion && "animate-pulse"
          )}
        />
      </div>
    </div>
  );
};

export default QuestionnaireProgress;