import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import ArticleLink from './ArticleLink';

interface QuestionDisplayProps {
  question: {
    id: string;
    question_text: string;
    options: string[];
    article_url?: string;
  };
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  onSubmitAnswer: () => void;
  hasAnswered: boolean;
  isCorrect?: boolean;
  isSubmitting: boolean;
  correctAnswer?: string;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  onSubmitAnswer,
  hasAnswered,
  isCorrect,
  isSubmitting,
  correctAnswer,
}) => {
  const { toast } = useToast();

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    const words = text.split(" ");
    let partialLength = 0;
    for (let i = 0; i < words.length; i++) {
      partialLength += words[i].length + 1;
      if (partialLength > maxLength) {
        return words.slice(0, i).join(" ") + "...";
      }
    }
    return words.slice(0, partialLength).join(" ") + "...";
  };

  const handleSubmitClick = () => {
    if (!selectedAnswer) {
      toast({
        title: "Sélectionnez une réponse",
        description: "Veuillez choisir une réponse avant de valider.",
        variant: "destructive",
      });
      return;
    }

    if (!isSubmitting && !hasAnswered) {
      onSubmitAnswer();
    }
  };

  return (
    <div className="space-y-4">
      {question.article_url && (
        <ArticleLink url={question.article_url} onArticleRead={() => {}} />
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">{question.question_text}</h3>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !hasAnswered && onAnswerSelect(option)}
              disabled={hasAnswered}
              className={`w-full text-left p-4 rounded-lg border transition-colors ${
                selectedAnswer === option
                  ? hasAnswered
                    ? isCorrect
                      ? "bg-green-100 border-green-500"
                      : "bg-red-100 border-red-500"
                    : "bg-blue-100 border-blue-500"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {hasAnswered && (
          <Alert className={`mt-4 ${isCorrect ? "bg-green-50" : "bg-red-50"}`}>
            <AlertDescription>
              {isCorrect
                ? "Bonne réponse ! 🎉"
                : `La bonne réponse était : ${correctAnswer}`}
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSubmitClick}
            disabled={!selectedAnswer || isSubmitting || hasAnswered}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isSubmitting ? (
              "Validation..."
            ) : hasAnswered ? (
              "Validé"
            ) : (
              <>
                Valider <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionDisplay;