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
      const parsedQuestions = parseQuestionText(questionText);
      
      if (parsedQuestions.length === 0) {
        toast({
          title: "Erreur de format",
          description: "Le format des questions n'est pas valide. Veuillez vérifier la structure.",
          variant: "destructive",
        });
        return;
      }

      // Insérer toutes les questions
      const { error } = await supabase
        .from('question_bank')
        .insert(parsedQuestions.map(q => ({
          question_text: q.question_text,
          options: q.options,
          correct_answer: q.correct_answer,
          article_url: q.article_url,
          status: 'available'
        })));

      if (error) throw error;

      toast({
        title: "Succès",
        description: `${parsedQuestions.length} question(s) ajoutée(s) à la banque de questions`,
      });

      setQuestionText('');
      queryClient.invalidateQueries({ queryKey: ['question-bank'] });
    } catch (error) {
      console.error('Error adding questions:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter les questions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajout rapide de questions</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder={`Format attendu:

Question : Votre question ici ?

Source : https://...

Réponses proposées:
Option 1
Option 2
Option 3
Option 4

Réponse correcte: La réponse correcte`}
            className="min-h-[300px]"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Ajout en cours...' : 'Ajouter les questions'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuickAddQuestion;