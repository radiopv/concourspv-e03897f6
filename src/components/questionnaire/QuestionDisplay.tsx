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

  const handleSubmitClick = () => {
    if (!selectedAnswer || isSubmitting || hasAnswered) {
      return;
    }
    onSubmitAnswer();
  };

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
          disabled={!selectedAnswer || isSubmitting || hasAnswered}
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