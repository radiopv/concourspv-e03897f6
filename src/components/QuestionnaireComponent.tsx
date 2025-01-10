import React, { useEffect, useState } from 'react';
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
import { useQuery } from "@tanstack/react-query";

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
  const [countdown, setCountdown] = useState(5);
  const [showQuestions, setShowQuestions] = useState(false);

  useAttempts(contestId);

  // Countdown effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowQuestions(true);
    }
  }, [countdown]);

  // Récupérer les paramètres globaux
  const { data: settings } = useQuery({
    queryKey: ['global-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      return data?.[0];
    }
  });

  // Vérifier si le participant a déjà complété le quiz
  const { data: participant } = useQuery({
    queryKey: ['participant-status', contestId],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) return null;

      const { data, error } = await supabase
        .from('participants')
        .select('status, score')
        .eq('contest_id', contestId)
        .eq('id', session.session.user.id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    if (participant?.status === 'completed') {
      navigate('/quiz-completion', {
        state: {
          score: participant.score,
          totalQuestions: questions?.length || 0,
          contestId: contestId,
          requiredPercentage: settings?.required_percentage || 90
        }
      });
      return;
    }
  }, [participant, navigate, questions?.length, contestId, settings]);

  useEffect(() => {
    const initializeParticipant = async () => {
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

        // Get user profile data first
        const { data: userProfile } = await supabase
          .from('members')
          .select('first_name, last_name, email')
          .eq('id', session.session.user.id)
          .single();

        if (!userProfile) {
          console.error('User profile not found');
          toast({
            title: "Erreur",
            description: "Profil utilisateur non trouvé",
            variant: "destructive",
          });
          return;
        }

        // First, check if participant exists
        const { data: existingParticipant } = await supabase
          .from('participants')
          .select('participation_id')
          .eq('id', session.session.user.id)
          .eq('contest_id', contestId)
          .maybeSingle();

        // If participant exists, update their record
        if (existingParticipant?.participation_id) {
          const { error: updateError } = await supabase
            .from('participants')
            .update({
              status: 'pending',
              attempts: 0,
              score: 0,
              first_name: userProfile.first_name,
              last_name: userProfile.last_name,
              email: userProfile.email
            })
            .eq('participation_id', existingParticipant.participation_id);

          if (updateError) {
            console.error('Error updating participant:', updateError);
            throw updateError;
          }
        } else {
          // If participant doesn't exist, create a new record
          const participation_id = crypto.randomUUID();
          const { error: insertError } = await supabase
            .from('participants')
            .insert({
              participation_id,
              id: session.session.user.id,
              contest_id: contestId,
              status: 'pending',
              attempts: 0,
              score: 0,
              first_name: userProfile.first_name,
              last_name: userProfile.last_name,
              email: userProfile.email
            });

          if (insertError) {
            console.error('Error inserting participant:', insertError);
            throw insertError;
          }
        }
        
        console.log('Participant initialized successfully');

      } catch (error) {
        console.error('Error initializing participant:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'initialisation",
          variant: "destructive",
        });
      }
    };

    initializeParticipant();
  }, [contestId, navigate, toast]);

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
        console.log('Starting quiz completion process...');
        
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user?.id) {
          throw new Error("User not authenticated");
        }

        const { data: participant, error: participantError } = await supabase
          .from('participants')
          .select('participation_id, attempts')
          .eq('contest_id', contestId)
          .eq('id', session.session.user.id)
          .single();

        if (participantError || !participant?.participation_id) {
          console.error('Error fetching participant:', participantError);
          throw new Error("Participant not found");
        }

        console.log('Participant found:', participant);

        const finalScore = await calculateFinalScore(participant.participation_id);
        console.log('Final score calculated:', finalScore);

        const { error: updateError } = await supabase
          .from('participants')
          .update({ 
            score: finalScore,
            status: 'completed',
            completed_at: new Date().toISOString(),
            attempts: (participant.attempts || 0) + 1
          })
          .eq('contest_id', contestId)
          .eq('id', session.session.user.id);

        if (updateError) {
          console.error('Error updating participant:', updateError);
          throw updateError;
        }

        await queryClient.invalidateQueries({ queryKey: ['contests'] });
        await queryClient.invalidateQueries({ queryKey: ['participants', contestId] });
        await queryClient.invalidateQueries({ queryKey: ['participant-status', contestId] });

        console.log('Quiz completed successfully. Navigating to completion page with score:', finalScore);

        navigate('/quiz-completion', {
          state: {
            score: finalScore,
            totalQuestions: questions?.length || 0,
            contestId: contestId,
            requiredPercentage: settings?.required_percentage || 90
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

  if (!showQuestions) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Préparez-vous !</h2>
            <p className="text-6xl font-bold text-indigo-600 mb-4">{countdown}</p>
            <p className="text-lg text-gray-600">Le quiz commence dans quelques secondes...</p>
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
          totalQuestions={questions?.length || 0}
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
          onSubmitAnswer={() => handleSubmitAnswer(currentQuestion)}
          onNextQuestion={handleNextQuestion}
          isLastQuestion={state.currentQuestionIndex === questions?.length - 1}
        />
      </CardContent>
    </Card>
  );
};

export default QuestionnaireComponent;
