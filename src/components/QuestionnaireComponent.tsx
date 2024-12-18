import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../App";

interface QuestionnaireComponentProps {
  contestId: string;
}

const QuestionnaireComponent = ({ contestId }: QuestionnaireComponentProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      const { error } = await supabase
        .from('participant_answers')
        .insert([
          {
            participant_id: session.session.user.id,
            question_id: currentQuestion.id,
            answer: selectedAnswer,
            is_correct: selectedAnswer === currentQuestion.correct_answer
          }
        ]);

      if (error) throw error;

      // Invalider les requêtes après soumission d'une réponse
      queryClient.invalidateQueries({ queryKey: ['contests'] });
      queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
      queryClient.invalidateQueries({ queryKey: ['participants', contestId] });

      setSelectedAnswer("");
      
      if (currentQuestionIndex < (questions?.length || 0) - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        toast({
          title: "Félicitations !",
          description: "Vous avez terminé le questionnaire",
        });
      }
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

  if (!questions || questions.length === 0) {
    return <div>Aucune question disponible.</div>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          Question {currentQuestionIndex + 1} sur {questions.length}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-lg font-medium">{currentQuestion?.question_text}</p>
          
          <RadioGroup
            value={selectedAnswer}
            onValueChange={setSelectedAnswer}
            className="space-y-3"
          >
            {currentQuestion?.options?.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>

          <Button
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Envoi en cours..." : "Valider la réponse"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionnaireComponent;