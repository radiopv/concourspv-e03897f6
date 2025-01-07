import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import AnswerOptions from './AnswerOptions';
import ArticleLink from './ArticleLink';

interface QuestionDisplayProps {
  questionText: string;
  articleUrl?: string | null;
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
  isLastQuestion,
}: QuestionDisplayProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{questionText}</h3>
        
        {articleUrl && (
          <ArticleLink
            url={articleUrl}
            hasClicked={hasClickedLink}
            onArticleRead={onArticleRead}
          />
        )}

        <AnswerOptions
          options={options}
          selectedAnswer={selectedAnswer}
          correctAnswer={correctAnswer}
          hasAnswered={hasAnswered}
          isDisabled={isSubmitting || hasAnswered || (!!articleUrl && !hasClickedLink)}
          onAnswerSelect={onAnswerSelect}
        />
      </div>

      <div className="flex justify-end space-x-4">
        {!hasAnswered ? (
          <Button
            onClick={onSubmitAnswer}
            disabled={!selectedAnswer || isSubmitting || (!!articleUrl && !hasClickedLink)}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Envoi...</span>
              </div>
            ) : (
              "Valider"
            )}
          </Button>
        ) : (
          <Button
            onClick={onNextQuestion}
            className="min-w-[120px]"
          >
            {isLastQuestion ? "Terminer" : "Question suivante"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuestionDisplay;