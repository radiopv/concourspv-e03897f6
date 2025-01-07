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
import { Loader2 } from "lucide-react";

interface QuestionnaireComponentProps {
  contestId: string;
}

const QuestionnaireComponent = ({ contestId }: QuestionnaireComponentProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const state = useQuestionnaireState();
  const { data: questions, isLoading: questionsLoading, error: questionsError } = useQuestions(contestId);
  const { handleSubmitAnswer, isSubmitting } = useAnswerSubmission(contestId);
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
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user?.id) {
          toast({
            title: "Erreur",
            description: "Vous devez être connecté pour participer",
            variant: "destructive",
          });
          navigate('/login');
          return;
        }

        const finalScore = await calculateFinalScore(session.session.user.id);
        await completeQuestionnaire(session.session.user.id, finalScore);

        const { data: participant } = await supabase
          .from('participants')
          .select('attempts')
          .eq('contest_id', contestId)
          .eq('id', session.session.user.id)
          .maybeSingle();

        if (!participant) {
          throw new Error("Participant not found");
        }

        const newAttempts = (participant.attempts || 0) + 1;

        await supabase
          .from('participants')
          .update({ 
            attempts: newAttempts,
            score: finalScore,
            points: finalScore * 10,
            completed_at: new Date().toISOString()
          })
          .eq('contest_id', contestId)
          .eq('id', session.session.user.id);

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

        queryClient.invalidateQueries({ queryKey: ['contests'] });
        queryClient.invalidateQueries({ queryKey: ['participants', contestId] });

        navigate(`/contests/${contestId}/stats`, { 
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
      }
    }
  };

  if (questionsLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (questionsError) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Une erreur est survenue lors du chargement des questions.
          </div>
        </CardContent>
      </Card>
    );
  }

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
          isSubmitting={isSubmitting}
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