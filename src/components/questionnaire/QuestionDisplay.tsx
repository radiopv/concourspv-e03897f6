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

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium">
        {hasClickedLink ? questionText : getPartialQuestion(questionText)}
      </p>
      
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
          onClick={onSubmitAnswer}
          disabled={!selectedAnswer || isSubmitting}
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