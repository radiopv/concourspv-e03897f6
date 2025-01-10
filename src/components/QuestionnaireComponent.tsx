import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useQuestions } from './questionnaire/useQuestions';
import { useQuestionnaireState } from './questionnaire/QuestionnaireState';
import { calculateFinalScore } from './questionnaire/QuestionnaireManager';
import QuestionnaireProgress from './questionnaire/QuestionnaireProgress';
import QuestionDisplay from './questionnaire/QuestionDisplay';
import { useAttempts } from './questionnaire/hooks/useAttempts';
import { useAnswerSubmission } from './questionnaire/hooks/useAnswerSubmission';

interface QuestionnaireComponentProps {
  contestId: string;
}

const QuestionnaireComponent = ({ contestId }: QuestionnaireComponentProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const state = useQuestionnaireState();
  const { data: questions } = useQuestions(contestId);
  const { handleSubmitAnswer } = useAnswerSubmission(contestId);
  const currentQuestion = questions?.[state.currentQuestionIndex];

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

        const { data: participant } = await supabase
          .from('participants')
          .select('participation_id, score')
          .eq('contest_id', contestId)
          .eq('id', session.session.user.id)
          .single();

        if (!participant?.participation_id) {
          throw new Error("Participant not found");
        }

        const newScore = await calculateFinalScore(participant.participation_id);
        const finalScore = Math.max(newScore, participant.score || 0);
        
        const { error: updateError } = await supabase
          .from('participants')
          .update({ 
            score: finalScore,
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('contest_id', contestId)
          .eq('id', session.session.user.id);

        if (updateError) throw updateError;

        const { data: participantData } = await supabase
          .from('participants')
          .select('attempts')
          .eq('contest_id', contestId)
          .eq('id', session.session.user.id)
          .single();

        const newAttempts = (participantData?.attempts || 0) + 1;

        await supabase
          .from('participants')
          .update({ attempts: newAttempts })
          .eq('contest_id', contestId)
          .eq('id', session.session.user.id);

        await queryClient.invalidateQueries({ queryKey: ['contests'] });
        await queryClient.invalidateQueries({ queryKey: ['participants', contestId] });

        toast({
          title: "Questionnaire terminé !",
          description: finalScore === 100 
            ? "Félicitations ! Vous avez obtenu un score parfait ! 🎉"
            : `Votre score est de ${finalScore}%. ${
                finalScore >= 70 
                  ? "Vous êtes éligible pour le tirage au sort !" 
                  : "Continuez à participer pour améliorer vos chances !"
              }`,
          duration: 5000,
        });

        setTimeout(() => {
          navigate('/contests');
        }, 1000);

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
        />
      </CardHeader>
      <CardContent className="space-y-6">
        {currentQuestion && (
          <QuestionDisplay
            question={currentQuestion}
            selectedAnswer={state.selectedAnswer}
            hasClickedLink={state.hasClickedLink}
            hasAnswered={state.hasAnswered}
            isSubmitting={state.isSubmitting}
            isLastQuestion={state.currentQuestionIndex === questions.length - 1}
            onArticleRead={() => state.setHasClickedLink(true)}
            onAnswerSelect={state.setSelectedAnswer}
            onSubmitAnswer={() => handleSubmitAnswer(currentQuestion)}
            onNextQuestion={handleNextQuestion}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionnaireComponent;