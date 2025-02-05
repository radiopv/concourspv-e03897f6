import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Trophy, Target } from "lucide-react";
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
  score,
  totalAnswered,
}: QuestionnaireProgressProps) => {
  const displayQuestionNumber = Math.min(currentQuestionIndex, totalQuestions);
  const progressPercentage = (displayQuestionNumber / totalQuestions) * 100;
  const isNearingCompletion = progressPercentage > 75;
  const scorePercentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return (
    <div className="space-y-4 animate-fade-in">
      <Alert className={cn(
        "mb-4 border-l-4 transition-colors duration-300",
        scorePercentage >= 80 ? "border-green-500 bg-green-50" : "border-amber-500 bg-amber-50"
      )}>
        <div className="flex items-center space-x-2">
          {scorePercentage >= 80 ? (
            <Trophy className="h-4 w-4 text-green-600 animate-bounce" />
          ) : (
            <Target className="h-4 w-4 text-amber-600" />
          )}
          <AlertDescription className={cn(
            "font-medium",
            scorePercentage >= 80 ? "text-green-600" : "text-amber-600"
          )}>
            {scorePercentage >= 80 
              ? "Excellent ! Continuez ainsi !" 
              : "Objectif : obtenir un score minimum de 80%"}
          </AlertDescription>
        </div>
      </Alert>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Question {displayQuestionNumber} sur {totalQuestions}</span>
          <span className={cn(
            "font-medium transition-colors",
            scorePercentage >= 80 ? "text-green-600" : "text-amber-600"
          )}>
            Score actuel : {scorePercentage}%
          </span>
        </div>
        
        <Progress 
          value={progressPercentage} 
          className={cn(
            "transition-all duration-500",
            isNearingCompletion && "animate-pulse"
          )}
        />
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>Questions répondues : {totalAnswered}/{totalQuestions}</span>
          <span>Score minimum requis : 80%</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireProgress;