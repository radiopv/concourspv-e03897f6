import React, { useState, useEffect } from 'react';
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
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {typeof questionText === 'string' ? questionText : 'Question non disponible'}
        </h3>
        
        {articleUrl && typeof articleUrl === 'string' && (
          <ArticleLink
            url={articleUrl}
            isRead={hasClickedLink}
            onArticleRead={onArticleRead}
          />
        )}

        <AnswerOptions
          options={renderOptions}
          selectedAnswer={selectedAnswer}
          correctAnswer={correctAnswer}
          hasAnswered={hasAnswered}
          isDisabled={!hasClickedLink || isSubmitting}
          onAnswerSelect={onAnswerSelect}
        />
      </div>

      <div className="flex justify-end space-x-2">
        {!hasAnswered ? (
          <Button
            onClick={onSubmitAnswer}
            disabled={!selectedAnswer || !hasClickedLink || !canSubmit || isSubmitting}
          >
            {!hasClickedLink 
              ? "Veuillez lire l'article d'abord" 
              : !canSubmit 
                ? "Veuillez patienter..." 
                : "Valider la réponse"}
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