import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ArticleLink from './ArticleLink';
import AnswerOptions from './AnswerOptions';

interface QuestionDisplayProps {
  question: {
    question_text: string;
    options: string[];
    article_url?: string;
    correct_answer?: string;
  };
  selectedAnswer: string;
  hasClickedLink: boolean;
  hasAnswered: boolean;
  isSubmitting: boolean;
  isLastQuestion: boolean;
  onArticleRead: () => void;
  onAnswerSelect: (answer: string) => void;
  onSubmitAnswer: () => Promise<void>;
  onNextQuestion: () => void;
}

const QuestionDisplay = ({
  question,
  selectedAnswer,
  hasClickedLink,
  hasAnswered,
  isSubmitting,
  isLastQuestion,
  onArticleRead,
  onAnswerSelect,
  onSubmitAnswer,
  onNextQuestion
}: QuestionDisplayProps) => {

  const handleSubmitClick = async () => {
    if (!selectedAnswer) return;
    await onSubmitAnswer();
  };

  const shouldShowAnswers = !question.article_url || hasClickedLink;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">{question.question_text}</h3>

      {question.article_url && (
        <ArticleLink 
          url={question.article_url} 
          onArticleRead={onArticleRead} 
        />
      )}

      {shouldShowAnswers ? (
        <>
          <AnswerOptions
            options={question.options}
            selectedAnswer={selectedAnswer}
            correctAnswer={hasAnswered ? question.correct_answer : undefined}
            hasAnswered={hasAnswered}
            isDisabled={isSubmitting}
            onAnswerSelect={onAnswerSelect}
          />

          {hasAnswered && (
            <Alert className={`mt-4 ${selectedAnswer === question.correct_answer ? "bg-green-50" : "bg-red-50"}`}>
              <AlertDescription>
                {selectedAnswer === question.correct_answer
                  ? "Bonne réponse ! 🎉"
                  : `La bonne réponse était : ${question.correct_answer}`}
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-6 flex justify-end">
            {!hasAnswered ? (
              <Button
                onClick={handleSubmitClick}
                disabled={!selectedAnswer || isSubmitting}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isSubmitting ? (
                  "Validation..."
                ) : (
                  <>
                    Valider <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={onNextQuestion}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isLastQuestion ? "Terminer" : "Question suivante"} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </>
      ) : (
        <div className="text-center p-4">
          <p className="text-gray-600">Veuillez lire l'article avant de répondre à la question.</p>
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay;