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
import { useToast } from "@/hooks/use-toast";

interface QuestionnaireComponentProps {
  contestId: string;
}

const QuestionnaireComponent: React.FC<QuestionnaireComponentProps> = ({ contestId }) => {
  const state = useQuestionnaireState();
  const { toast } = useToast();
  const { settings, userProfile, participant, questions, refetchParticipant } = useQuestionnaireQueries(contestId);
  
  useParticipantInitialization(contestId, userProfile, refetchParticipant);
  const { handleNextQuestion } = useAnswerHandling(contestId, participant, questions || [], settings);

  // Check if participant has reached maximum attempts
  const hasReachedMaxAttempts = participant?.attempts >= (settings?.default_attempts || 3);

  // Display error message if max attempts reached
  if (hasReachedMaxAttempts) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Limite de tentatives atteinte</AlertTitle>
          <AlertDescription>
            Vous avez atteint le nombre maximum de tentatives ({settings?.default_attempts || 3}) pour ce concours.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="space-y-8">
        {contestId && (
          <ParticipantCheck 
            participant={participant} 
            settings={settings}
            contestId={contestId}
            questionsLength={questions?.length || 0}
          />
        )}
        
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