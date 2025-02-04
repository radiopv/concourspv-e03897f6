import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
  // Ensure currentQuestionIndex doesn't exceed totalQuestions
  const displayQuestionNumber = Math.min(currentQuestionIndex, totalQuestions);

  return (
    <div className="space-y-4">
      <Alert className="mb-4 border-amber-500 bg-amber-50 dark:bg-amber-900/10">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-600">
          Attention : Une seule participation est autorisée. Vous devez obtenir un score minimum de 80% pour valider.
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>Question {displayQuestionNumber} sur {totalQuestions}</span>
        <span>Score actuel : {score}%</span>
      </div>
      <Progress value={(displayQuestionNumber / totalQuestions) * 100} />
      <div className="flex justify-between text-sm text-gray-600">
        <span>Questions répondues : {totalAnswered}/{totalQuestions}</span>
        <span>Score minimum requis : 80%</span>
      </div>
    </div>
  );
};

export default QuestionnaireProgress;