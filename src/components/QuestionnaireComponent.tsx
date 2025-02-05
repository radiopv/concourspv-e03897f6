import React from 'react';
import { useQuestionnaireState } from './questionnaire/QuestionnaireState';
import QuestionDisplay from './questionnaire/QuestionDisplay';
import QuestionnaireProgress from './questionnaire/QuestionnaireProgress';
import { useQuestionnaireQueries } from './questionnaire/hooks/useQuestionnaireQueries';
import { useParticipantInitialization } from './questionnaire/hooks/useParticipantInitialization';
import { useAnswerHandling } from './questionnaire/hooks/useAnswerHandling';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface QuestionnaireComponentProps {
  contestId: string;
}

const QuestionnaireComponent: React.FC<QuestionnaireComponentProps> = ({ contestId }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const state = useQuestionnaireState();
  const { settings, userProfile, participant, questions, refetchParticipant } = useQuestionnaireQueries(contestId);
  
  // Vérifier si l'utilisateur est connecté
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Alert className="mb-6 border-blue-500 bg-blue-50 dark:bg-blue-900/10">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle>Connexion requise</AlertTitle>
          <AlertDescription className="mt-2 text-blue-600">
            Vous devez être connecté pour participer à ce concours.
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-4">
          <Button 
            onClick={() => navigate('/login')}
            className="bg-primary hover:bg-primary/90"
          >
            Se connecter
          </Button>
        </div>
      </div>
    );
  }
  
  // Initialize participant
  useParticipantInitialization(contestId, userProfile, refetchParticipant);
  
  // Setup answer handling
  const { handleNextQuestion } = useAnswerHandling(contestId, participant, questions || [], settings);

  // Check if participant has already completed this contest
  const hasAlreadyParticipated = participant?.status === 'completed';

  // Display message if already participated
  if (hasAlreadyParticipated) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Alert className="mb-6 border-blue-500 bg-blue-50 dark:bg-blue-900/10">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle>Participation terminée</AlertTitle>
          <AlertDescription className="mt-2 text-blue-600">
            Vous avez déjà participé à ce concours. Bonne chance pour les prochains défis !
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-4">
          <Button 
            onClick={() => navigate('/contests')}
            className="bg-primary hover:bg-primary/90"
          >
            Voir les autres concours
          </Button>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Chargement...</AlertTitle>
          <AlertDescription>
            Préparation du questionnaire en cours.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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