import React from 'react';
import { useQuestionnaireState } from './questionnaire/QuestionnaireState';
import QuestionDisplay from './questionnaire/QuestionDisplay';
import QuestionnaireProgress from './questionnaire/QuestionnaireProgress';
import ParticipantCheck from './questionnaire/ParticipantCheck';
import { useQuestionnaireQueries } from './questionnaire/hooks/useQuestionnaireQueries';
import { useParticipantInitialization } from './questionnaire/hooks/useParticipantInitialization';
import { useAnswerHandling } from './questionnaire/hooks/useAnswerHandling';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface QuestionnaireComponentProps {
  contestId: string;
}

const QuestionnaireComponent: React.FC<QuestionnaireComponentProps> = ({ contestId }) => {
  const state = useQuestionnaireState();
  const { settings, userProfile, participant, questions, refetchParticipant } = useQuestionnaireQueries(contestId);
  
  // Check if participant has already completed this contest
  const hasAlreadyParticipated = participant?.status === 'completed';

  // Display error message if already participated
  if (hasAlreadyParticipated) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Participation non autorisée</AlertTitle>
          <AlertDescription>
            Vous avez déjà participé à ce concours. Une seule participation est autorisée.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // If not already participated, initialize participant
  useParticipantInitialization(contestId, userProfile, refetchParticipant);
  const { handleNextQuestion } = useAnswerHandling(contestId, participant, questions || [], settings);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="space-y-8">
        {participant && questions && questions.length > 0 && (
          <>
            <QuestionnaireProgress 
              currentQuestionIndex={state.currentQuestionIndex + 1}
              totalQuestions={questions.length}
              score={state.score}
              totalAnswered={state.totalAnswered}
            />

            <QuestionDisplay
              questionText={questions[state.currentQuestionIndex].question_text}
              articleUrl={questions[state.currentQuestionIndex].article_url}
              options={questions[state.currentQuestionIndex].options}
              selectedAnswer={state.selectedAnswer}
              correctAnswer={questions[state.currentQuestionIndex].correct_answer}
              hasClickedLink={state.hasClickedLink}
              hasAnswered={state.hasAnswered}
              isSubmitting={state.isSubmitting}
              onArticleRead={() => state.setHasClickedLink(true)}
              onAnswerSelect={(answer: string) => state.setSelectedAnswer(answer)}
              onSubmitAnswer={handleNextQuestion}
              onNextQuestion={handleNextQuestion}
              isLastQuestion={state.currentQuestionIndex === questions.length - 1}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionnaireComponent;