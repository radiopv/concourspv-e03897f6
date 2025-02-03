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

  const { data: participant } = useQuery({
    queryKey: ['participant-status', contestId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return null;

      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('contest_id', contestId)
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data as Participant | null;
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

        const { data: existingParticipant, error: checkError } = await supabase
          .from('participants')
          .select('*')
          .eq('contest_id', contestId)
          .eq('id', session.user.id)
          .maybeSingle();

        if (checkError) throw checkError;

        if (existingParticipant?.status === 'completed') {
          return;
        }

        if (!existingParticipant) {
          console.log('Creating new participant with profile:', userProfile);
          const { error: insertError } = await supabase
            .from('participants')
            .insert([
              {
                id: session.user.id,
                contest_id: contestId,
                status: 'pending',
                attempts: 1,
                first_name: userProfile.first_name,
                last_name: userProfile.last_name,
                email: userProfile.email,
                score: 0
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

    const currentQuestion = questions?.[state.currentQuestionIndex];
    const isCorrect = currentQuestion && state.selectedAnswer === currentQuestion.correct_answer;

    // Update score if answer is correct
    if (isCorrect) {
      const newScore = ((state.totalAnswered + 1) / (questions?.length || 1)) * 100;
      state.setScore(Math.round(newScore));
    }

    // Increment total answered questions
    state.setTotalAnswered(prev => prev + 1);

    if (state.currentQuestionIndex < (questions?.length || 0) - 1) {
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

        // Calculate final score based on correct answers
        const correctAnswers = questions?.reduce((count, question, index) => {
          const answer = state.selectedAnswer; // Get the answer for this question
          return count + (answer === question.correct_answer ? 1 : 0);
        }, 0) || 0;

        const totalQuestions = questions?.length || 0;
        const finalScore = Math.round((correctAnswers / totalQuestions) * 100);

        console.log('Final score calculation:', {
          correctAnswers,
          totalQuestions,
          finalScore
        });

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

        // Save each answer to participant_answers
        const { data: participant } = await supabase
          .from('participants')
          .select('participation_id')
          .eq('contest_id', contestId)
          .eq('id', session.user.id)
          .single();

        if (participant?.participation_id) {
          const { error: answersError } = await supabase
            .from('participant_answers')
            .insert(
              questions?.map((question, index) => ({
                participant_id: participant.participation_id,
                question_id: question.id,
                answer: state.selectedAnswer,
                is_correct: state.selectedAnswer === question.correct_answer,
                attempt_number: 1
              })) || []
            );

          if (answersError) {
            console.error('Error saving answers:', answersError);
          }
        }

        navigate('/quiz-completion', {
          state: {
            score: finalScore,
            totalQuestions,
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