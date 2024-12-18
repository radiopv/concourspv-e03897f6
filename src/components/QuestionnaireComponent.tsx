import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../App";
import { ExternalLink, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionnaireComponentProps {
  contestId: string;
}

const QuestionnaireComponent = ({ contestId }: QuestionnaireComponentProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasClickedLink, setHasClickedLink] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const { data: questions } = useQuery({
    queryKey: ['questions', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('contest_id', contestId)
        .order('order_number');
      
      if (error) throw error;
      return data;
    }
  });

  const currentQuestion = questions?.[currentQuestionIndex];

  const handleLinkClick = () => {
    setHasClickedLink(true);
    // Ouvrir le lien dans un nouvel onglet
    if (currentQuestion?.article_url) {
      window.open(currentQuestion.article_url, '_blank');
    }
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

      const isAnswerCorrect = selectedAnswer === currentQuestion.correct_answer;
      setIsCorrect(isAnswerCorrect);
      setHasAnswered(true);

      const { error } = await supabase
        .from('participant_answers')
        .insert([
          {
            participant_id: session.session.user.id,
            question_id: currentQuestion.id,
            answer: selectedAnswer,
            is_correct: isAnswerCorrect
          }
        ]);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['contests'] });
      queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
      queryClient.invalidateQueries({ queryKey: ['participants', contestId] });

      toast({
        title: isAnswerCorrect ? "Bonne réponse ! 🎉" : "Mauvaise réponse",
        description: isAnswerCorrect 
          ? "Continuez comme ça !" 
          : `La bonne réponse était : ${currentQuestion.correct_answer}`,
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
      toast({
        title: "Félicitations !",
        description: "Vous avez terminé le questionnaire",
      });
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
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">
            Question {currentQuestionIndex + 1} sur {questions.length}
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {Math.round((currentQuestionIndex / questions.length) * 100)}% complété
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <p className="text-lg font-medium">{currentQuestion?.question_text}</p>
          
          {currentQuestion?.article_url && (
            <Button
              variant="outline"
              className={cn(
                "w-full flex items-center justify-center gap-2",
                hasClickedLink && "bg-green-50"
              )}
              onClick={handleLinkClick}
            >
              <ExternalLink className="w-4 h-4" />
              {hasClickedLink ? "Article consulté" : "Lire l'article pour débloquer la question"}
            </Button>
          )}
          
          <RadioGroup
            value={selectedAnswer}
            onValueChange={setSelectedAnswer}
            className="space-y-3"
          >
            {currentQuestion?.options?.map((option: string, index: number) => (
              <div 
                key={index} 
                className={cn(
                  "flex items-center space-x-2 p-3 rounded-lg border transition-all",
                  !hasClickedLink && "opacity-50 cursor-not-allowed",
                  hasAnswered && option === currentQuestion.correct_answer && "border-green-500 bg-green-50",
                  hasAnswered && option === selectedAnswer && option !== currentQuestion.correct_answer && "border-red-500 bg-red-50"
                )}
              >
                <RadioGroupItem 
                  value={option} 
                  id={`option-${index}`}
                  disabled={!hasClickedLink || hasAnswered}
                />
                <Label 
                  htmlFor={`option-${index}`}
                  className={cn(
                    "flex-1 cursor-pointer",
                    !hasClickedLink && "cursor-not-allowed"
                  )}
                >
                  {option}
                </Label>
                {hasAnswered && option === currentQuestion.correct_answer && (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
                {hasAnswered && option === selectedAnswer && option !== currentQuestion.correct_answer && (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            ))}
          </RadioGroup>

          {!hasAnswered ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer || !hasClickedLink || isSubmitting}
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