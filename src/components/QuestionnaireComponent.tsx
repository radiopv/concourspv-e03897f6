import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuestions } from './questionnaire/useQuestions';
import QuestionDisplay from './questionnaire/QuestionDisplay';
import QuestionnaireProgress from './questionnaire/QuestionnaireProgress';
import { useQuestionnaireQueries } from './questionnaire/hooks/useQuestionnaireQueries';
import { Question } from '@/types/database';

interface QuestionnaireComponentProps {
  contestId: string;
}

const QuestionnaireComponent: React.FC<QuestionnaireComponentProps> = ({ contestId }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [hasClickedLink, setHasClickedLink] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const { data: questions } = useQuestions(contestId);
  const { participant, refetchParticipant } = useQuestionnaireQueries(contestId);

  const currentQuestion = questions?.[currentQuestionIndex];
  const totalQuestions = questions?.length || 0;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleArticleRead = () => {
    setHasClickedLink(true);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || isSubmitting) return;

    setIsSubmitting(true);
    // Submit the answer logic here
    setHasAnswered(true);
    setIsSubmitting(false);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
      setHasClickedLink(false);
      setHasAnswered(false);
    } else {
      navigate(`/quiz-completion/${contestId}`);
    }
  };

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      <QuestionnaireProgress 
        currentQuestionIndex={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        score={0}
        totalAnswered={currentQuestionIndex}
      />
      
      <div className="mt-8">
        <QuestionDisplay
          questionText={currentQuestion.question_text}
          articleUrl={currentQuestion.article_url}
          options={currentQuestion.options as string[]}
          selectedAnswer={selectedAnswer}
          correctAnswer={currentQuestion.correct_answer}
          hasClickedLink={hasClickedLink}
          hasAnswered={hasAnswered}
          isSubmitting={isSubmitting}
          onArticleRead={handleArticleRead}
          onAnswerSelect={handleAnswerSelect}
          onSubmitAnswer={handleSubmitAnswer}
          onNextQuestion={handleNextQuestion}
          isLastQuestion={currentQuestionIndex + 1 === totalQuestions}
        />
      </div>
    </div>
  );
};

export default QuestionnaireComponent;