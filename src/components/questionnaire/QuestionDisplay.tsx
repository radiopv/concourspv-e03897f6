import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import ArticleLink from './ArticleLink';
import AnswerOptions from './AnswerOptions';

interface QuestionDisplayProps {
  questionText: string;
  articleUrl?: string;
  options: string[];
  selectedAnswer: string;
  correctAnswer?: string;
  hasClickedLink: boolean;
  hasAnswered: boolean;
  isSubmitting: boolean;
  onArticleRead: () => void;
  onAnswerSelect: (answer: string) => void;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
}

const QuestionDisplay = ({
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
}: QuestionDisplayProps) => {
  const getPartialQuestion = (text: string) => {
    if (!text) return "";
    const words = text.split(" ");
    const partialLength = Math.min(5, words.length);
    return words.slice(0, partialLength).join(" ") + "...";
  };

  // Utilisation d'une référence pour suivre si une soumission est en cours
  const isSubmittingRef = React.useRef(false);

  const handleSubmitClick = React.useCallback(async () => {
    console.log('Submit button clicked with state:', {
      selectedAnswer,
      hasAnswered,
      isSubmitting,
      hasClickedLink,
      isSubmittingRef: isSubmittingRef.current
    });

    // Vérifier si une soumission est déjà en cours ou si la réponse a déjà été donnée
    if (isSubmittingRef.current || hasAnswered || isSubmitting || !selectedAnswer) {
      console.log('Submit blocked because:', {
        isSubmittingRef: isSubmittingRef.current,
        hasAnswered,
        isSubmitting,
        selectedAnswer
      });
      return;
    }

    // Marquer le début de la soumission
    isSubmittingRef.current = true;

    try {
      console.log('Conditions met, submitting answer');
      await onSubmitAnswer();
    } finally {
      // Réinitialiser l'état de soumission
      isSubmittingRef.current = false;
    }
  }, [isSubmitting, hasAnswered, onSubmitAnswer, selectedAnswer, hasClickedLink]);

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium">
        {hasClickedLink ? questionText : getPartialQuestion(questionText)}
      </p>
      
      {articleUrl && !hasClickedLink && (
        <Alert className="bg-yellow-100 border-yellow-300">
          <InfoIcon className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 font-medium">
            Une fois l'article ouvert, prenez le temps de le lire. 
            La question apparaîtra automatiquement dans quelques secondes.
          </AlertDescription>
        </Alert>
      )}
      
      {articleUrl && (
        <ArticleLink
          url={articleUrl}
          onArticleRead={onArticleRead}
          isRead={hasClickedLink}
        />
      )}
      
      {(hasClickedLink || !articleUrl) && (
        <AnswerOptions
          options={options}
          selectedAnswer={selectedAnswer}
          correctAnswer={hasAnswered ? correctAnswer : undefined}
          hasAnswered={hasAnswered}
          isDisabled={articleUrl ? !hasClickedLink : false}
          onAnswerSelect={onAnswerSelect}
        />
      )}

      {!hasAnswered && (hasClickedLink || !articleUrl) && (
        <Button
          onClick={handleSubmitClick}
          disabled={!selectedAnswer || isSubmitting || hasAnswered || isSubmittingRef.current}
          className="w-full"
        >
          {isSubmitting ? "Envoi en cours..." : "Valider la réponse"}
        </Button>
      )}

      {hasAnswered && (
        <Button
          onClick={onNextQuestion}
          className="w-full"
          variant="outline"
          disabled={isSubmitting}
        >
          {isLastQuestion ? (
            "Terminer le quiz"
          ) : (
            <>
              Question suivante
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default QuestionDisplay;