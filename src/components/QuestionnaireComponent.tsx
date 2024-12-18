import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../App";
import { useQuestions } from './questionnaire/useQuestions';
import { ensureParticipantExists } from './questionnaire/ParticipantManager';
import { getRandomMessage } from './questionnaire/messages';
import QuestionnaireProgress from './questionnaire/QuestionnaireProgress';
import QuestionDisplay from './questionnaire/QuestionDisplay';
import { useQuestionnaireState } from './questionnaire/QuestionnaireState';
import { calculateFinalScore, completeQuestionnaire } from './questionnaire/QuestionnaireManager';

interface QuestionnaireComponentProps {
  contestId: string;
}

const QuestionnaireComponent = ({ contestId }: QuestionnaireComponentProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const state = useQuestionnaireState();
  const { data: questions } = useQuestions(contestId);
  const currentQuestion = questions?.[state.currentQuestionIndex];

  useEffect(() => {
    const checkAttempts = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user?.id) return;

        const { data: participant, error } = await supabase
          .from('participants')
          .select('attempts')
          .eq('contest_id', contestId)
          .eq('id', session.session.user.id)
          .single();

        if (error) {
          console.error('Error checking attempts:', error);
          return;
        }

        if (participant && participant.attempts >= 3) {
          toast({
            title: "Limite atteinte",
            description: "Vous avez déjà utilisé vos 3 tentatives pour ce questionnaire.",
            variant: "destructive",
          });
          navigate('/contests');
        }
      } catch (error) {
        console.error('Error in checkAttempts:', error);
      }
    };

    checkAttempts();
  }, [contestId, navigate, toast]);

  const handleSubmitAnswer = async () => {
    if (!state.selectedAnswer || !currentQuestion) return;

    state.setIsSubmitting(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour participer",
          variant: "destructive",
        });
        return;
      }

      const participantId = await ensureParticipantExists(session.session.user.id, contestId);

      const isAnswerCorrect = state.selectedAnswer === currentQuestion.correct_answer;
      state.setIsCorrect(isAnswerCorrect);
      state.setHasAnswered(true);
      state.setTotalAnswered(prev => prev + 1);
      if (isAnswerCorrect) {
        state.setScore(prev => prev + 1);
      }

      const { error } = await supabase
        .from('participant_answers')
        .insert([{
          participant_id: participantId,
          question_id: currentQuestion.id,
          answer: state.selectedAnswer
        }]);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['contests'] });
      queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
      queryClient.invalidateQueries({ queryKey: ['participants', contestId] });

      const message = getRandomMessage(isAnswerCorrect);
      toast({
        title: isAnswerCorrect ? "Bonne réponse ! 🎉" : "Mauvaise réponse",
        description: message,
        variant: isAnswerCorrect ? "default" : "destructive",
      });

    } catch (error) {
      console.error('Error submitting answer:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission de votre réponse",
        variant: "destructive",
      });
    } finally {
      state.setIsSubmitting(false);
    }
  };

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
        await completeQuestionnaire(session.session.user.id, contestId, finalScore);

        // Get current attempts and increment
        const { data: participant, error: fetchError } = await supabase
          .from('participants')
          .select('attempts')
          .eq('contest_id', contestId)
          .eq('id', session.session.user.id)
          .single();

        if (fetchError) throw fetchError;

        const newAttempts = (participant?.attempts || 0) + 1;

        // Update attempts count
        const { error: updateError } = await supabase
          .from('participants')
          .update({ attempts: newAttempts })
          .eq('contest_id', contestId)
          .eq('id', session.session.user.id);

        if (updateError) throw updateError;

        toast({
          title: "Questionnaire terminé ! 🎉",
          description: `Votre score final est de ${finalScore}%. ${
            finalScore >= 70 
              ? "Félicitations ! Vous êtes éligible pour le tirage au sort !" 
              : "Continuez à participer pour améliorer vos chances !"
          }`,
          duration: 5000,
        });

        // Redirection après 3 secondes
        setTimeout(() => {
          navigate('/contests', { 
            state: { 
              completedContestId: contestId,
              showResults: true,
              finalScore: finalScore
            }
          });
        }, 3000);

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
        <QuestionDisplay
          questionText={currentQuestion?.question_text || ""}
          articleUrl={currentQuestion?.article_url}
          options={currentQuestion?.options || []}
          selectedAnswer={state.selectedAnswer}
          correctAnswer={currentQuestion?.correct_answer}
          hasClickedLink={state.hasClickedLink}
          hasAnswered={state.hasAnswered}
          isSubmitting={state.isSubmitting}
          onArticleRead={() => state.setHasClickedLink(true)}
          onAnswerSelect={state.setSelectedAnswer}
          onSubmitAnswer={handleSubmitAnswer}
          onNextQuestion={handleNextQuestion}
          isLastQuestion={state.currentQuestionIndex === questions.length - 1}
        />
      </CardContent>
    </Card>
  );
};

export default QuestionnaireComponent;