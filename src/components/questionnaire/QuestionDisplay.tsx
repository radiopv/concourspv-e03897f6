import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { getRandomMessage } from './messages';
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
      {!hasClickedLink && articleUrl && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
          <p className="flex items-center text-blue-700 mb-2">
            <BookOpen className="w-5 h-5 mr-2" />
            Conseil important
          </p>
          <p className="text-blue-600">
            Prenez le temps de lire l'article attentivement. La réponse s'y trouve !
          </p>
        </div>
      )}

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
        <>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-4">
            <p className="text-purple-700">
              {getRandomMessage()}
            </p>
          </div>

          <AnswerOptions
            options={options}
            selectedAnswer={selectedAnswer}
            correctAnswer={hasAnswered ? correctAnswer : undefined}
            hasAnswered={hasAnswered}
            isDisabled={articleUrl && !hasClickedLink}
            onAnswerSelect={onAnswerSelect}
          />
        </>
      )}

      {!hasAnswered && (hasClickedLink || !articleUrl) && (
        <Button
          onClick={onSubmitAnswer}
          disabled={!selectedAnswer || (articleUrl && !hasClickedLink) || isSubmitting}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
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