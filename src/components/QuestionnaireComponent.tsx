import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuestions } from './questionnaire/useQuestions';
import QuestionDisplay from './questionnaire/QuestionDisplay';
import QuestionnaireProgress from './questionnaire/QuestionnaireProgress';
import { useQuestionnaireQueries } from './questionnaire/hooks/useQuestionnaireQueries';
import { Question } from '@/types/database';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface QuestionnaireComponentProps {
  contestId: string;
}

const QuestionnaireComponent: React.FC<QuestionnaireComponentProps> = ({ contestId }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [hasClickedLink, setHasClickedLink] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: questions } = useQuestions(contestId);
  const { participant, refetchParticipant } = useQuestionnaireQueries(contestId);

  useEffect(() => {
    const checkExistingParticipation = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;

      const { data: existingParticipation, error } = await supabase
        .from('participants')
        .select('participation_id, status, score')
        .eq('contest_id', contestId)
        .eq('id', session.user.id)
        .eq('status', 'completed')
        .maybeSingle();

      if (error) {
        console.error('Error checking participation:', error);
        return;
      }

      if (existingParticipation) {
        toast({
          title: "Participation existante",
          description: "Vous avez déjà participé à ce concours. Une seule participation est autorisée.",
        });
        navigate(`/quiz-completion/${contestId}`);
      }
    };

    checkExistingParticipation();
  }, [contestId, navigate, toast]);

  const currentQuestion = questions?.[currentQuestionIndex];
  const totalQuestions = questions?.length || 0;
  const answeredQuestions = currentQuestionIndex + (hasAnswered ? 1 : 0);

  const handleArticleRead = () => {
    setHasClickedLink(true);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || isSubmitting || !currentQuestion) return;

    setIsSubmitting(true);
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }

      const { data: userProfile, error: profileError } = await supabase
        .from('members')
        .select('first_name, last_name, email')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        throw new Error('Could not fetch user profile');
      }

      if (!userProfile?.first_name || !userProfile?.last_name || !userProfile?.email) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Votre profil est incomplet. Veuillez le compléter avant de participer."
        });
        navigate('/profile');
        return;
      }

      // Get or create participant
      const { data: existingParticipant } = await supabase
        .from('participants')
        .select('participation_id')
        .eq('contest_id', contestId)
        .eq('id', session.user.id)
        .maybeSingle();

      let participationId = existingParticipant?.participation_id;

      if (!participationId) {
        console.log('Creating new participant with profile:', userProfile);
        
        const { data: newParticipant, error: createError } = await supabase
          .from('participants')
          .insert({
            id: session.user.id,
            contest_id: contestId,
            status: 'pending',
            first_name: userProfile.first_name,
            last_name: userProfile.last_name,
            email: userProfile.email
          })
          .select('participation_id')
          .single();

        if (createError) {
          console.error('Error creating participant:', createError);
          throw createError;
        }
        
        participationId = newParticipant.participation_id;
        console.log('Created new participant with ID:', participationId);
      }

      // Save the answer
      const { error: answerError } = await supabase
        .from('participant_answers')
        .insert({
          participant_id: participationId,
          contest_id: contestId,
          question_id: currentQuestion.id,
          answer: selectedAnswer,
          is_correct: isCorrect,
          attempt_number: 1
        });

      if (answerError) throw answerError;
      
      if (isCorrect) {
        setCorrectAnswers(prev => prev + 1);
      }
      
      setHasAnswered(true);
      
      // Automatically progress to next question after 2 seconds
      setTimeout(() => {
        if (currentQuestionIndex + 1 < totalQuestions) {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedAnswer('');
          setHasClickedLink(false);
          setHasAnswered(false);
        } else {
          // Calculate final score
          const finalScore = Math.round((correctAnswers / totalQuestions) * 100);
          console.log('Final score:', finalScore, 'Correct answers:', correctAnswers, 'Total questions:', totalQuestions);
          
          // Update participant status to completed using async/await
          const updateParticipant = async () => {
            try {
              const { error: updateError } = await supabase
                .from('participants')
                .update({ 
                  status: 'completed',
                  score: finalScore,
                  completed_at: new Date().toISOString()
                })
                .eq('participation_id', participationId);
              
              if (updateError) throw updateError;
              
              navigate(`/quiz-completion/${contestId}`);
            } catch (error) {
              console.error('Error updating participant status:', error);
              toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de mettre à jour votre statut"
              });
            }
          };
          
          updateParticipant();
        }
      }, 2000);

    } catch (error) {
      console.error('Error submitting answer:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer votre réponse"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      <QuestionnaireProgress 
        currentQuestionIndex={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        score={scorePercentage}
        totalAnswered={answeredQuestions}
      />
      
      <div className="mt-8">
        <QuestionDisplay
          questionText={currentQuestion.question_text}
          articleUrl={currentQuestion.article_url}
          options={Array.isArray(currentQuestion.options) ? currentQuestion.options : []}
          selectedAnswer={selectedAnswer}
          correctAnswer={currentQuestion.correct_answer}
          hasClickedLink={hasClickedLink}
          hasAnswered={hasAnswered}
          isSubmitting={isSubmitting}
          onArticleRead={handleArticleRead}
          onAnswerSelect={handleAnswerSelect}
          onSubmitAnswer={handleSubmitAnswer}
          onNextQuestion={() => {}}
          isLastQuestion={currentQuestionIndex + 1 === totalQuestions}
        />
      </div>
    </div>
  );
};

export default QuestionnaireComponent;