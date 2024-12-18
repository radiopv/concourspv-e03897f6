import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../App";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ArticleLink from './questionnaire/ArticleLink';
import AnswerOptions from './questionnaire/AnswerOptions';
import { useQuestions } from './questionnaire/useQuestions';
import { ensureParticipantExists } from './questionnaire/ParticipantManager';
import { getRandomMessage } from './questionnaire/messages';

interface QuestionnaireComponentProps {
  contestId: string;
}

const QuestionnaireComponent = ({ contestId }: QuestionnaireComponentProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasClickedLink, setHasClickedLink] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const { data: questions } = useQuestions(contestId);
  const currentQuestion = questions?.[currentQuestionIndex];

  const calculateProgress = () => {
    if (!questions || questions.length === 0) return 0;
    return Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
  };

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

      // Ensure participant exists and get participant ID
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

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (questions?.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer("");
      setHasClickedLink(false);
      setHasAnswered(false);
      setIsCorrect(null);
    } else {
      // Questionnaire completed
      toast({
        title: "Félicitations ! 🎉",
        description: "Vous avez terminé le questionnaire. Vous allez être redirigé vers la liste des concours.",
      });
      // Redirect to contests list after a short delay
      setTimeout(() => {
        navigate('/contests');
      }, 2000);
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

  const progress = calculateProgress();

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fadeIn">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">
            Question {currentQuestionIndex + 1} sur {questions.length}
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {progress}% complété
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <p className="text-lg font-medium">{currentQuestion?.question_text}</p>
          
          {currentQuestion?.article_url && (
            <ArticleLink
              url={currentQuestion.article_url}
              onArticleRead={() => setHasClickedLink(true)}
            />
          )}
          
          <AnswerOptions
            options={currentQuestion?.options || []}
            selectedAnswer={selectedAnswer}
            correctAnswer={hasAnswered ? currentQuestion?.correct_answer : undefined}
            hasAnswered={hasAnswered}
            isDisabled={currentQuestion?.article_url && !hasClickedLink}
            onAnswerSelect={setSelectedAnswer}
          />

          {!hasAnswered ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer || (currentQuestion?.article_url && !hasClickedLink) || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Envoi en cours..." : "Valider la réponse"}
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              className="w-full"
              variant="outline"
            >
              {currentQuestionIndex === questions.length - 1 ? (
                "Terminer le quiz"
              ) : (
                <>
                  Question suivante
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionnaireComponent;