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
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
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
        const { data: newParticipant, error: createError } = await supabase
          .from('participants')
          .insert({
            id: session.user.id,
            contest_id: contestId,
            status: 'pending'
          })
          .select('participation_id')
          .single();

        if (createError) throw createError;
        participationId = newParticipant.participation_id;
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
          // Update participant status to completed
          supabase
            .from('participants')
            .update({ 
              status: 'completed',
              score: Math.round((correctAnswers / totalQuestions) * 100),
              completed_at: new Date().toISOString()
            })
            .eq('participation_id', participationId)
            .then(() => {
              navigate(`/quiz-completion/${contestId}`);
            });
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