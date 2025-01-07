import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../App";
import { useQuestions } from './questionnaire/useQuestions';
import { useQuestionnaireState } from './questionnaire/QuestionnaireState';
import { calculateFinalScore, completeQuestionnaire } from './questionnaire/QuestionnaireManager';
import QuestionnaireProgress from './questionnaire/QuestionnaireProgress';
import QuestionDisplay from './questionnaire/QuestionDisplay';
import { useAttempts } from './questionnaire/hooks/useAttempts';
import { useAnswerSubmission } from './questionnaire/hooks/useAnswerSubmission';
import { useContestAI } from '@/hooks/useContestAI';

interface QuestionnaireComponentProps {
  contestId: string;
}

const QuestionnaireComponent = ({ contestId }: QuestionnaireComponentProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const state = useQuestionnaireState();
  const { data: questions } = useQuestions(contestId);
  const { handleSubmitAnswer, isSubmitting: isSubmittingAnswer } = useAnswerSubmission(contestId);
  const currentQuestion = questions?.[state.currentQuestionIndex];
  const { getParticipantFeedback } = useContestAI();

  useAttempts(contestId);

  const handleNextQuestion = async () => {
    if (state.currentQuestionIndex < (questions?.length || 0) - 1) {
      state.setCurrentQuestionIndex(prev => prev + 1);
      state.setSelectedAnswer("");
      state.setHasClickedLink(false);
      state.setHasAnswered(false);
      state.setIsCorrect(null);
    } else {
      state.setIsSubmitting(true);
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user?.id) {
          throw new Error("User not authenticated");
        }

        const finalScore = await calculateFinalScore(session.session.user.id);
        if (finalScore === undefined || finalScore === null) {
          throw new Error("Failed to calculate final score");
        }

        await completeQuestionnaire(session.session.user.id, finalScore);

        // Get current participant
        const { data: participant } = await supabase
          .from('participants')
          .select('id')
          .eq('email', session.session.user.email)
          .single();

        if (participant) {
          // Get current participation
          const { data: participation } = await supabase
            .from('participations')
            .select('*')
            .eq('participant_id', participant.id)
            .eq('contest_id', contestId)
            .order('attempts', { ascending: false })
            .limit(1)
            .single();

          if (participation) {
            await supabase
              .from('participations')
              .update({ 
                score: finalScore,
                completed_at: new Date().toISOString()
              })
              .eq('id', participation.id);
          }
        }

        // Get AI-powered feedback
        const feedback = await getParticipantFeedback(finalScore, "Contest");

        toast({
          title: "Questionnaire terminé ! 🎉",
          description: `${feedback || `Votre score final est de ${finalScore}%. ${
            finalScore >= 70 
              ? "Félicitations ! Vous êtes éligible pour le tirage au sort !" 
              : "Continuez à participer pour améliorer vos chances !"
          }`}`,
          duration: 5000,
        });

        navigate(`/contest/${contestId}/stats`, { 
          state: { 
            finalScore: finalScore
          }
        });

      } catch (error) {
        console.error('Error completing questionnaire:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la finalisation du questionnaire",
          variant: "destructive",
        });
      } finally {
        state.setIsSubmitting(false);
      }
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-lg text-gray-600">Aucune question disponible.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fadeIn">
      <CardHeader>
        <QuestionnaireProgress
          currentQuestionIndex={state.currentQuestionIndex}
          totalQuestions={questions.length}
          score={state.score}
          totalAnswered={state.totalAnswered}
          correctAnswers={state.score}
        />
      </CardHeader>
      <CardContent className="space-y-6">
        <QuestionDisplay
          questionText={currentQuestion?.question_text || ""}
          articleUrl={currentQuestion?.article_url}
          options={currentQuestion?.options || []}
          selectedAnswer={state.selectedAnswer}
          correctAnswer={currentQuestion?.correct_answer}
          hasClickedLink={state.hasClickedLink}
          hasAnswered={state.hasAnswered}
          isSubmitting={state.isSubmitting || isSubmittingAnswer}
          onArticleRead={() => state.setHasClickedLink(true)}
          onAnswerSelect={state.setSelectedAnswer}
          onSubmitAnswer={() => handleSubmitAnswer(currentQuestion)}
          onNextQuestion={handleNextQuestion}
          isLastQuestion={state.currentQuestionIndex === questions.length - 1}
        />
      </CardContent>
    </Card>
  );
};

export default QuestionnaireComponent;