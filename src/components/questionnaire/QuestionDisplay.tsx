import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  // S'assurer que les options sont bien un tableau de chaînes
  const renderOptions = Array.isArray(options) 
    ? options.map(opt => typeof opt === 'string' ? opt : String(opt))
    : [];

  return (
    <div className="space-y-6">
      <Card>
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
                  className="inline-flex items-center text-primary hover:text-primary/80"
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

            <RadioGroup
              value={selectedAnswer}
              onValueChange={onAnswerSelect}
              className="space-y-3"
              disabled={isSubmitting}
            >
              {renderOptions.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-end space-x-4 mt-6">
              {!hasAnswered ? (
                <Button
                  onClick={onSubmitAnswer}
                  disabled={!selectedAnswer || isSubmitting || (articleUrl && !canSubmit)}
                >
                  {isSubmitting ? "Envoi en cours..." : "Valider la réponse"}
                </Button>
              ) : (
                <Button
                  onClick={onNextQuestion}
                  disabled={isSubmitting}
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