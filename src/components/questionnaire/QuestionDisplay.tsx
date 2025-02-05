import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import AnswerOptions from './AnswerOptions';
import { useToast } from "@/hooks/use-toast";
import ArticleLink from './ArticleLink';

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
}) => {
  const [canSubmit, setCanSubmit] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const { toast } = useToast();
  const isCorrect = hasAnswered && selectedAnswer === correctAnswer;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (hasClickedLink && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanSubmit(true);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [hasClickedLink, countdown]);

  useEffect(() => {
    if (hasAnswered) {
      toast({
        description: isCorrect ? 
          "🎉 Excellente réponse ! Continue comme ça !" :
          "😮 Oups ! Ce n'est pas la bonne réponse.",
        className: cn(
          "border",
          isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
        ),
        duration: 2000,
      });
    }
  }, [hasAnswered, isCorrect, toast]);

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{questionText}</h3>

            {articleUrl && (
              <ArticleLink 
                url={articleUrl}
                isRead={hasClickedLink}
                onArticleRead={onArticleRead}
              />
            )}

            {!hasClickedLink && articleUrl && (
              <Alert>
                <AlertDescription>
                  Veuillez lire l'article avant de répondre à la question
                </AlertDescription>
              </Alert>
            )}

            {hasClickedLink && countdown > 0 && (
              <Alert className="bg-blue-50 border-blue-200">
                <Timer className="h-4 w-4 text-blue-600 animate-spin" />
                <AlertDescription className="text-blue-600">
                  Merci de patienter {countdown} secondes avant de répondre...
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
                isDisabled={isSubmitting || !hasClickedLink || countdown > 0}
                onAnswerSelect={onAnswerSelect}
              />
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              {!hasAnswered && (
                <Button
                  onClick={onSubmitAnswer}
                  disabled={!selectedAnswer || isSubmitting || !canSubmit}
                  className={cn(
                    "bg-primary hover:bg-primary/90 transition-colors",
                    (!canSubmit || !selectedAnswer) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? "Envoi en cours..." : "Valider la réponse"}
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