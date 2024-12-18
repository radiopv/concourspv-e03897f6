import React, { useState } from 'react';
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

interface QuestionnaireComponentProps {
  contestId: string;
}

const QuestionnaireComponent = ({ contestId }: QuestionnaireComponentProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasClickedLink, setHasClickedLink] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const { data: questions } = useQuestions(contestId);
  const currentQuestion = questions?.[currentQuestionIndex];

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !currentQuestion) return;

    setIsSubmitting(true);
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

      const isAnswerCorrect = selectedAnswer === currentQuestion.correct_answer;
      setIsCorrect(isAnswerCorrect);
      setHasAnswered(true);

      const { error } = await supabase
        .from('participant_answers')
        .insert([{
          participant_id: participantId,
          question_id: currentQuestion.id,
          answer: selectedAnswer
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
      setIsSubmitting(false);
    }
  };

  const completeQuestionnaire = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) return false;

      const { error } = await supabase
        .from('participants')
        .update({ status: 'completed' })
        .eq('contest_id', contestId)
        .eq('id', session.session.user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error completing questionnaire:', error);
      return false;
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < (questions?.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer("");
      setHasClickedLink(false);
      setHasAnswered(false);
      setIsCorrect(null);
    } else {
      setIsSubmitting(true);
      const success = await completeQuestionnaire();
      if (success) {
        toast({
          title: "Félicitations ! 🎉",
          description: "Vous avez terminé le questionnaire avec succès !",
        });
        // Redirection après un court délai
        setTimeout(() => {
          navigate('/contests');
        }, 2000);
      } else {
        setIsSubmitting(false);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la finalisation du questionnaire",
          variant: "destructive",
        });
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
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
        />
      </CardHeader>
      <CardContent className="space-y-6">
        <QuestionDisplay
          questionText={currentQuestion?.question_text || ""}
          articleUrl={currentQuestion?.article_url}
          options={currentQuestion?.options || []}
          selectedAnswer={selectedAnswer}
          correctAnswer={currentQuestion?.correct_answer}
          hasClickedLink={hasClickedLink}
          hasAnswered={hasAnswered}
          isSubmitting={isSubmitting}
          onArticleRead={() => setHasClickedLink(true)}
          onAnswerSelect={setSelectedAnswer}
          onSubmitAnswer={handleSubmitAnswer}
          onNextQuestion={handleNextQuestion}
          isLastQuestion={currentQuestionIndex === questions.length - 1}
        />
      </CardContent>
    </Card>
  );
};

export default QuestionnaireComponent;