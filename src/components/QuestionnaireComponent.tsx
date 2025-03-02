
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuestions } from './questionnaire/useQuestions';
import QuestionDisplay from './questionnaire/QuestionDisplay';
import QuestionnaireProgress from './questionnaire/QuestionnaireProgress';
import { useQuestionnaireQueries } from './questionnaire/hooks/useQuestionnaireQueries';
import { useParticipantManagement } from './questionnaire/hooks/useParticipantManagement';
import { useAnswerSubmission } from './questionnaire/hooks/useAnswerSubmission';

interface QuestionnaireComponentProps {
  contestId: string;
}

const QuestionnaireComponent: React.FC<QuestionnaireComponentProps> = ({ contestId }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [hasClickedLink, setHasClickedLink] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const navigate = useNavigate();
  
  const { data: questions } = useQuestions(contestId);
  const { participant, refetchParticipant } = useQuestionnaireQueries(contestId);
  const { isSubmitting, checkExistingParticipation, createOrUpdateParticipant } = useParticipantManagement(contestId);
  const { correctAnswers, submitAnswer, completeQuestionnaire } = useAnswerSubmission(contestId);

  useEffect(() => {
    checkExistingParticipation();
  }, []);

  const currentQuestion = questions?.[currentQuestionIndex];
  const totalQuestions = questions?.length || 0;
  const answeredQuestions = currentQuestionIndex + (hasAnswered ? 1 : 0);

  const handleArticleRead = () => {
    setHasClickedLink(true);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || isSubmitting || !currentQuestion) return;

    const participationId = await createOrUpdateParticipant();
    if (!participationId) return;

    const isCorrect = await submitAnswer(participationId, {
      ...currentQuestion,
      status: currentQuestion.status as 'available' | 'archived' | 'in_use'
    }, selectedAnswer, totalQuestions);
    
    setHasAnswered(true);

    setTimeout(() => {
      if (currentQuestionIndex + 1 < totalQuestions) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer('');
        setHasClickedLink(false);
        setHasAnswered(false);
      } else {
        completeQuestionnaire(participationId, totalQuestions);
      }
    }, 2000);
  };

  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      <QuestionnaireProgress 
        currentQuestionIndex={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        score={scorePercentage}
        totalAnswered={answeredQuestions}
      />
      
      <div className="mt-8">
        <QuestionDisplay
          questionText={currentQuestion.question_text}
          articleUrl={currentQuestion.article_url}
          options={Array.isArray(currentQuestion.options) ? currentQuestion.options : []}
          selectedAnswer={selectedAnswer}
          correctAnswer={currentQuestion.correct_answer}
          hasClickedLink={hasClickedLink}
          hasAnswered={hasAnswered}
          isSubmitting={isSubmitting}
          onArticleRead={handleArticleRead}
          onAnswerSelect={handleAnswerSelect}
          onSubmitAnswer={handleSubmitAnswer}
          onNextQuestion={() => {}}
          isLastQuestion={currentQuestionIndex + 1 === totalQuestions}
        />
      </div>
    </div>
  );
};

export default QuestionnaireComponent;
