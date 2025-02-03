import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useQuestionnaireState } from './questionnaire/QuestionnaireState';
import QuestionDisplay from './questionnaire/QuestionDisplay';
import QuestionnaireProgress from './questionnaire/QuestionnaireProgress';
import ParticipantCheck from './questionnaire/ParticipantCheck';
import type { Participant } from '@/types/database';

interface QuestionnaireComponentProps {
  contestId: string;
}

const QuestionnaireComponent: React.FC<QuestionnaireComponentProps> = ({ contestId }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const state = useQuestionnaireState();

  const { data: settings } = useQuery({
    queryKey: ['global-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });

  const { data: userProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return null;

      const { data, error } = await supabase
        .from('members')
        .select('first_name, last_name, email')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });

  const { data: participant, refetch: refetchParticipant } = useQuery({
    queryKey: ['participant-status', contestId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return null;

      // First, try to find an active participation
      const { data: activeParticipations, error: activeError } = await supabase
        .from('participants')
        .select('*')
        .eq('contest_id', contestId)
        .eq('id', session.user.id)
        .eq('status', 'pending')
        .is('completed_at', null);

      if (activeError) throw activeError;
      if (activeParticipations && activeParticipations.length > 0) {
        return activeParticipations[0];
      }

      // If no active participation found, get the most recent one
      const { data: recentParticipation, error: recentError } = await supabase
        .from('participants')
        .select('*')
        .eq('contest_id', contestId)
        .eq('id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (recentError) throw recentError;
      return recentParticipation?.[0] || null;
    },
    enabled: !!contestId
  });

  const { data: questions } = useQuery({
    queryKey: ['questions', contestId],
    queryFn: async () => {
      if (!contestId) throw new Error('Contest ID is required');
      
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

  useEffect(() => {
    const initializeParticipant = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          toast({
            title: "Non connecté",
            description: "Vous devez être connecté pour participer",
            variant: "destructive"
          });
          navigate('/login');
          return;
        }

        if (!userProfile) {
          console.log('Waiting for user profile data...');
          return;
        }

        // First check for an active participation
        const { data: existingActive } = await supabase
          .from('participants')
          .select('*')
          .eq('contest_id', contestId)
          .eq('id', session.user.id)
          .eq('status', 'pending')
          .is('completed_at', null);

        if (existingActive && existingActive.length > 0) {
          console.log('Found existing active participation:', existingActive[0]);
          await refetchParticipant();
          return;
        }

        // If no active participation, create a new one
        const { data: newParticipation, error: insertError } = await supabase
          .from('participants')
          .insert({
            id: session.user.id,
            contest_id: contestId,
            status: 'pending',
            first_name: userProfile.first_name,
            last_name: userProfile.last_name,
            email: userProfile.email,
            score: 0
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating participant:', insertError);
          if (insertError.message === 'User already has an active participation in this contest') {
            await refetchParticipant();
            return;
          }
          throw insertError;
        }

        console.log('Successfully created new participation:', newParticipation);
        await queryClient.invalidateQueries({ queryKey: ['participant-status', contestId] });

      } catch (error: any) {
        console.error('Error initializing participant:', error);
        if (error.message !== 'User already has an active participation in this contest') {
          toast({
            title: "Erreur",
            description: "Impossible d'initialiser la participation",
            variant: "destructive"
          });
        }
      }
    };

    if (contestId && userProfile) {
      initializeParticipant();
    }
  }, [contestId, queryClient, toast, navigate, userProfile]);

  const handleNextQuestion = async () => {
    if (!state.selectedAnswer) {
      toast({
        title: "Attention",
        description: "Veuillez sélectionner une réponse avant de continuer",
        variant: "destructive"
      });
      return;
    }

    if (!questions || !questions.length) {
      console.error('No questions available');
      return;
    }

    const currentQuestion = questions[state.currentQuestionIndex];
    
    // Validate answer against the question's correct_answer
    const isCorrect = currentQuestion?.correct_answer === state.selectedAnswer;
    console.log('Answer validation:', {
      selectedAnswer: state.selectedAnswer,
      correctAnswer: currentQuestion?.correct_answer,
      isCorrect
    });

    // Update total correct answers if the answer is correct
    if (isCorrect) {
      state.setTotalAnswered(prev => prev + 1);
      
      // Award points for correct answer
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          const { error: pointsError } = await supabase
            .from('point_history')
            .insert([{
              user_id: session.user.id,
              points: 10, // Award 10 points per correct answer
              source: 'contest_answer',
              contest_id: contestId,
              streak: state.totalAnswered + 1
            }]);

          if (pointsError) throw pointsError;

          // Update user_points
          const { error: updateError } = await supabase
            .from('user_points')
            .upsert([{
              user_id: session.user.id,
              total_points: state.totalAnswered * 10, // Calculate total points
              current_streak: state.totalAnswered + 1,
              best_streak: Math.max(state.totalAnswered + 1, state.totalAnswered)
            }]);

          if (updateError) throw updateError;
        }
      } catch (error) {
        console.error('Error awarding points:', error);
      }
    }

    // Calculate current score based on total correct answers
    const newScore = Math.round((state.totalAnswered / questions.length) * 100);
    state.setScore(newScore);

    console.log('Score calculation:', {
      totalAnswered: state.totalAnswered,
      questionsLength: questions.length,
      newScore
    });

    if (state.currentQuestionIndex < questions.length - 1) {
      state.setCurrentQuestionIndex(prev => prev + 1);
      state.setSelectedAnswer('');
      state.setHasAnswered(false);
      state.setHasClickedLink(false);
    } else {
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

        // Calculate final score based on total correct answers
        const finalScore = Math.round((state.totalAnswered / questions.length) * 100);

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

        // Save answers to participant_answers
        if (participant?.participation_id) {
          const answersToSave = questions.map((question, index) => ({
            participant_id: participant.participation_id,
            question_id: question.id,
            answer: state.selectedAnswer,
            is_correct: state.selectedAnswer === question.correct_answer,
            attempt_number: 1
          }));

          const { error: answersError } = await supabase
            .from('participant_answers')
            .insert(answersToSave);

          if (answersError) {
            console.error('Error saving answers:', answersError);
          }
        }

        navigate('/quiz-completion', {
          state: {
            score: finalScore,
            totalQuestions: questions.length,
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