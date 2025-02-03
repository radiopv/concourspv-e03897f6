import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useQuestionnaireState } from './questionnaire/QuestionnaireState';
import QuestionDisplay from './questionnaire/QuestionDisplay';
import QuestionnaireProgress from './questionnaire/QuestionnaireProgress';
import CountdownTimer from './questionnaire/CountdownTimer';
import ParticipantCheck from './questionnaire/ParticipantCheck';
import { calculateFinalScore } from '@/utils/scoreCalculations';
import type { Participant } from '@/types/database';

const QuestionnaireComponent = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const state = useQuestionnaireState();

  // Redirect if no contestId
  useEffect(() => {
    if (!contestId) {
      console.error('No contest ID provided');
      toast({
        title: "Erreur",
        description: "ID du concours manquant",
        variant: "destructive"
      });
      navigate('/contests');
    }
  }, [contestId, navigate, toast]);

  // Fetch contest settings
  const { data: settings } = useQuery({
    queryKey: ['global-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();

      if (error) throw error;
      return data;
    }
  });

  // Fetch participant status
  const { data: participant } = useQuery({
    queryKey: ['participant-status', contestId],
    queryFn: async () => {
      if (!contestId) {
        console.log('No contest ID, returning null');
        return null;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return null;

      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('contest_id', contestId)
        .eq('id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as Participant | null;
    },
    enabled: !!contestId
  });

  // Fetch questions
  const { data: questions } = useQuery({
    queryKey: ['questions', contestId],
    queryFn: async () => {
      if (!contestId) {
        console.error('Contest ID is required for fetching questions');
        throw new Error('Contest ID is required');
      }
      
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('contest_id', contestId)
        .order('order_number', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!contestId
  });

  // Initialize participant
  useEffect(() => {
    const initializeParticipant = async () => {
      if (!contestId) {
        console.error('Cannot initialize participant without contest ID');
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) return;

        const { data: existingParticipant, error: fetchError } = await supabase
          .from('participants')
          .select('*')
          .eq('contest_id', contestId)
          .eq('id', session.user.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

        if (!existingParticipant) {
          const { error: insertError } = await supabase
            .from('participants')
            .insert([
              {
                id: session.user.id,
                contest_id: contestId,
                status: 'pending',
                attempts: 0
              }
            ]);

          if (insertError) throw insertError;
        }

        await queryClient.invalidateQueries({ queryKey: ['participant-status', contestId] });
      } catch (error) {
        console.error('Error initializing participant:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'initialiser la participation",
          variant: "destructive"
        });
      }
    };

    initializeParticipant();
  }, [contestId, queryClient, toast]);

  const handleNextQuestion = async () => {
    if (!contestId) {
      console.error('Cannot handle next question without contest ID');
      return;
    }

    if (state.currentQuestionIndex < (questions?.length || 0) - 1) {
      state.setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz completed
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          toast({
            title: "Erreur",
            description: "Vous devez être connecté pour terminer le quiz",
            variant: "destructive"
          });
          return;
        }

        // Calculate final score
        const finalScore = calculateFinalScore(questions?.length || 0, state.score);

        // Update participant status
        const { error: updateError } = await supabase
          .from('participants')
          .update({ 
            score: finalScore,
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('contest_id', contestId)
          .eq('id', session.user.id);

        if (updateError) throw updateError;

        // Navigate to completion page
        navigate('/quiz-completion', {
          state: {
            score: finalScore,
            totalQuestions: questions?.length || 0,
            contestId,
            requiredPercentage: settings?.required_percentage || 90
          }
        });

      } catch (error) {
        console.error('Error completing quiz:', error);
        toast({
          title: "Erreur",
          description: "Impossible de terminer le quiz",
          variant: "destructive"
        });
      }
    }
  };

  if (!contestId) {
    console.log('No contest ID, returning null');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="space-y-8">
        <ParticipantCheck 
          participant={participant} 
          settings={settings}
          contestId={contestId}
          questionsLength={questions?.length || 0}
        />
        
        {participant && questions && questions.length > 0 && (
          <>
            <QuestionnaireProgress 
              currentQuestionIndex={state.currentQuestionIndex + 1}
              totalQuestions={questions.length}
              score={state.score}
              totalAnswered={state.totalAnswered}
            />
            
            <CountdownTimer 
              countdown={300} 
              onCountdownComplete={handleNextQuestion}
              isDisabled={false}
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