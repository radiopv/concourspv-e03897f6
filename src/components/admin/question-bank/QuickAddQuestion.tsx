import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { parseQuestionText } from '@/utils/questionParser';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQueryClient } from '@tanstack/react-query';

const QuickAddQuestion = () => {
  const [questionText, setQuestionText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const parsedQuestion = parseQuestionText(questionText);
      
      if (!parsedQuestion) {
        toast({
          title: "Erreur de format",
          description: "Le format de la question n'est pas valide. Veuillez vérifier la structure.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('question_bank')
        .insert([{
          question_text: parsedQuestion.question_text,
          options: parsedQuestion.options,
          correct_answer: parsedQuestion.correct_answer,
          article_url: parsedQuestion.article_url,
          status: 'available'
        }]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La question a été ajoutée à la banque de questions",
      });

      setQuestionText('');
      queryClient.invalidateQueries({ queryKey: ['question-bank'] });
    } catch (error) {
      console.error('Error adding question:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la question",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajout rapide de question</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder={`Format attendu:
Question: Votre question ici

Réponses proposées:
Option 1
Option 2
Option 3
Option 4

Réponse correcte: La réponse correcte

URL de l'article: https://...`}
            className="min-h-[300px]"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Ajout en cours...' : 'Ajouter la question'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuickAddQuestion;