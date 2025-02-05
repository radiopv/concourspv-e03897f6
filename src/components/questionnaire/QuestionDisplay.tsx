import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import AnswerOptions from './AnswerOptions';
import { useToast } from "@/hooks/use-toast";

interface QuestionDisplayProps {
  questionText: string;
  articleUrl?: string;
  options: string[];
  selectedAnswer: string;
  correctAnswer: string;
  hasClickedLink: boolean;
  hasAnswered: boolean;
  isSubmitting: boolean;
  onArticleRead: () => void;
  onAnswerSelect: (answer: string) => void;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  questionText,
  articleUrl,
  options,
  selectedAnswer,
  correctAnswer,
  hasClickedLink,
  hasAnswered,
  isSubmitting,
  onArticleRead,
  onAnswerSelect,
  onSubmitAnswer,
  onNextQuestion,
  isLastQuestion
}) => {
  const [canSubmit, setCanSubmit] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const { toast } = useToast();
  const isCorrect = hasAnswered && selectedAnswer === correctAnswer;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (hasClickedLink) {
      timer = setTimeout(() => {
        setCanSubmit(true);
      }, 5000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [hasClickedLink]);

  useEffect(() => {
    if (hasAnswered) {
      setShowFeedback(true);
      const message = isCorrect ? 
        "🎉 Excellente réponse ! Continue comme ça !" :
        "😮 Oups ! Ce n'est pas la bonne réponse.";
      
      toast({
        description: message,
        className: cn(
          "border",
          isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
        )
      });

      const timer = setTimeout(() => {
        setShowFeedback(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [hasAnswered, isCorrect, toast]);

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{questionText}</h3>

            {articleUrl && (
              <div className="my-4">
                <a
                  href={articleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onArticleRead}
                  className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Lire l'article pour répondre
                </a>
              </div>
            )}

            {!hasClickedLink && articleUrl && (
              <Alert>
                <AlertDescription>
                  Veuillez lire l'article avant de répondre à la question
                </AlertDescription>
              </Alert>
            )}

            <div className={cn(
              "transition-all duration-300",
              hasAnswered && (isCorrect ? "animate-bounce-once" : "animate-shake")
            )}>
              <AnswerOptions
                options={options}
                selectedAnswer={selectedAnswer}
                correctAnswer={hasAnswered ? correctAnswer : undefined}
                hasAnswered={hasAnswered}
                isDisabled={isSubmitting}
                onAnswerSelect={onAnswerSelect}
              />
            </div>

            {showFeedback && (
              <div className={cn(
                "flex items-center justify-center p-4 rounded-lg transition-all duration-300",
                isCorrect ? "bg-green-50" : "bg-red-50"
              )}>
                {isCorrect ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <Sparkles className="w-5 h-5" />
                    <span>Excellent !</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-red-600">
                    <XCircle className="w-5 h-5" />
                    <span>Pas tout à fait...</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-4 mt-6">
              {!hasAnswered ? (
                <Button
                  onClick={onSubmitAnswer}
                  disabled={!selectedAnswer || isSubmitting || (articleUrl && !canSubmit)}
                  className="bg-primary hover:bg-primary/90 transition-colors"
                >
                  {isSubmitting ? "Envoi en cours..." : "Valider la réponse"}
                </Button>
              ) : (
                <Button
                  onClick={onNextQuestion}
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90 transition-colors"
                >
                  {isLastQuestion ? "Terminer le quiz" : "Question suivante"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionDisplay;