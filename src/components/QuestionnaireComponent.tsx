import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import QuestionDisplay from './questionnaire/QuestionDisplay';
import QuestionnaireProgress from './questionnaire/QuestionnaireProgress';
import { useQuestionnaireState } from './questionnaire/QuestionnaireState';
import { Card, CardContent } from "@/components/ui/card";
import { useAnswerSubmission } from './questionnaire/hooks/useAnswerSubmission';
import CountdownTimer from './questionnaire/CountdownTimer';
import ParticipantCheck from './questionnaire/ParticipantCheck';
import { calculateFinalScore } from '@/utils/scoreCalculations';
import type { Participant } from '@/types/participant';

const QuestionnaireComponent = () => {
  const { contestId = '' } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const state = useQuestionnaireState();
  const [countdown, setCountdown] = useState(5);
  const [showQuestions, setShowQuestions] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ['global-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const { data: participant } = useQuery({
    queryKey: ['participant-status', contestId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getSession();
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('contest_id', contestId)
        .eq('id', user.id)
        .maybeSingle();

      if (error && error.code === 'PGRST116') return null;
      if (error) throw error;
      return data as Participant;
    }
  });

  const { data: questions } = useQuery({
    queryKey: ['questions', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('contest_id', contestId)
        .order('order_number', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  const handleCountdownComplete = () => {
    setCountdown(prev => prev - 1);
    if (countdown <= 1) {
      setShowQuestions(true);
    }
  };

  useEffect(() => {
    const initializeParticipant = async () => {
      try {
        const { data: { user } } = await supabase.auth.getSession();
        if (!user?.id) {
          toast({
            title: "Erreur",
            description: "Vous devez être connecté pour participer",
            variant: "destructive",
          });
          navigate('/login');
          return;
        }

        const { data: userProfile } = await supabase
          .from('members')
          .select('first_name, last_name, email')
          .eq('id', user.id)
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

        const { data: existingParticipant, error: checkError } = await supabase
          .from('participants')
          .select('participation_id, attempts')
          .eq('id', user.id)
          .eq('contest_id', contestId)
          .maybeSingle();

        if (checkError && checkError.code !== 'PGRST116') {
          throw checkError;
        }

        if (existingParticipant?.participation_id) {
          const { error: updateError } = await supabase
            .from('participants')
            .update({
              status: 'pending',
              attempts: (existingParticipant.attempts || 0) + 1,
              score: 0,
              first_name: userProfile.first_name,
              last_name: userProfile.last_name,
              email: userProfile.email,
              updated_at: new Date().toISOString()
            })
            .eq('participation_id', existingParticipant.participation_id);

          if (updateError) throw updateError;
        } else {
          const participation_id = crypto.randomUUID();
          const { error: insertError } = await supabase
            .from('participants')
            .insert({
              participation_id,
              id: user.id,
              contest_id: contestId,
              status: 'pending',
              attempts: 1,
              score: 0,
              first_name: userProfile.first_name,
              last_name: userProfile.last_name,
              email: userProfile.email,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (insertError) throw insertError;
        }

        await queryClient.invalidateQueries({ queryKey: ['participant-status', contestId] });
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
  }, [contestId, navigate, toast, queryClient]);

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
        if (!session?.user?.id) {
          throw new Error("User not authenticated");
        }

        const { data: participant, error: participantError } = await supabase
          .from('participants')
          .select('participation_id, attempts')
          .eq('contest_id', contestId)
          .eq('id', session.user.id)
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
          .eq('id', session.user.id);

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
      <Card>
        <CardContent className="p-6">
          <p className="text-center">Aucune question n'est disponible pour ce concours.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <ParticipantCheck
        participant={participant}
        settings={settings}
        contestId={contestId}
        questionsLength={questions.length}
      />

      {!showQuestions ? (
        <CountdownTimer
          countdown={countdown}
          onCountdownComplete={handleCountdownComplete}
          isDisabled={participant?.attempts >= (settings?.default_attempts || 3)}
        />
      ) : (
        <Card>
          <CardContent className="p-6 space-y-6">
            <QuestionnaireProgress
              currentQuestionIndex={useQuestionnaireState.getState().currentQuestionIndex}
              totalQuestions={questions.length}
              score={useQuestionnaireState.getState().score}
              totalAnswered={useQuestionnaireState.getState().totalAnswered}
            />
            <QuestionDisplay
              questionText={questions[useQuestionnaireState.getState().currentQuestionIndex].question_text}
              articleUrl={questions[useQuestionnaireState.getState().currentQuestionIndex].article_url}
              options={questions[useQuestionnaireState.getState().currentQuestionIndex].options}
              selectedAnswer={useQuestionnaireState.getState().selectedAnswer}
              correctAnswer={useQuestionnaireState.getState().hasAnswered ? 
                questions[useQuestionnaireState.getState().currentQuestionIndex].correct_answer : 
                undefined}
              hasClickedLink={useQuestionnaireState.getState().hasClickedLink}
              hasAnswered={useQuestionnaireState.getState().hasAnswered}
              isSubmitting={useQuestionnaireState.getState().isSubmitting}
              onArticleRead={() => useQuestionnaireState.getState().setHasClickedLink(true)}
              onAnswerSelect={(answer) => useQuestionnaireState.getState().setSelectedAnswer(answer)}
              onSubmitAnswer={() => useAnswerSubmission(contestId).handleSubmitAnswer(
                questions[useQuestionnaireState.getState().currentQuestionIndex]
              )}
              onNextQuestion={() => {
                if (useQuestionnaireState.getState().currentQuestionIndex < questions.length - 1) {
                  useQuestionnaireState.getState().setCurrentQuestionIndex(prev => prev + 1);
                  useQuestionnaireState.getState().setSelectedAnswer('');
                  useQuestionnaireState.getState().setHasClickedLink(false);
                  useQuestionnaireState.getState().setHasAnswered(false);
                }
              }}
              isLastQuestion={useQuestionnaireState.getState().currentQuestionIndex === questions.length - 1}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuestionnaireComponent;
