import React from 'react';
import { Button } from "@/components/ui/button";
import ArticleLink from './ArticleLink';

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

        <div className="space-y-2">
          {Array.isArray(options) && options.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === option ? "default" : "outline"}
              className={`w-full justify-start ${
                hasAnswered
                  ? option === correctAnswer
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : option === selectedAnswer
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : ""
                  : ""
              }`}
              onClick={() => !hasAnswered && onAnswerSelect(option)}
              disabled={hasAnswered || isSubmitting}
            >
              {option}
            </Button>
          ))}
        </div>
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