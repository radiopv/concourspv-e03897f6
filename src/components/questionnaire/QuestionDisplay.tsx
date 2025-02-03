import React from 'react';
import { Button } from "@/components/ui/button";
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
  isLastQuestion,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{questionText}</h3>
        
        {articleUrl && (
          <ArticleLink
            url={articleUrl}
            isRead={hasClickedLink}
            onArticleRead={onArticleRead}
          />
        )}

        <AnswerOptions
          options={options}
          selectedAnswer={selectedAnswer}
          correctAnswer={correctAnswer}
          hasAnswered={hasAnswered}
          isDisabled={isSubmitting}
          onAnswerSelect={onAnswerSelect}
        />
      </div>

      <div className="flex justify-end space-x-2">
        {!hasAnswered ? (
          <Button
            onClick={onSubmitAnswer}
            disabled={!selectedAnswer || !hasClickedLink || isSubmitting}
          >
            Valider la réponse
          </Button>
        ) : (
          <Button onClick={onNextQuestion}>
            {isLastQuestion ? "Terminer" : "Question suivante"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuestionDisplay;