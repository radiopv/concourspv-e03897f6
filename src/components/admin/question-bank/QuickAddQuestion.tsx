import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { parseQuestionText } from "@/utils/questionParser";

const QuickAddQuestion = () => {
  const { toast } = useToast();
  const [bulkText, setBulkText] = useState('');

  const handleSubmit = async () => {
    try {
      const parsedQuestions = parseQuestionText(bulkText);
      
      if (parsedQuestions.length === 0) {
        toast({
          title: "Erreur de format",
          description: "Le format des questions n'est pas valide. Veuillez vérifier la structure.",
          variant: "destructive",
        });
        return;
      }

      // Insert into questions table instead of question_bank
      const { error } = await supabase
        .from('questions')
        .insert(
          parsedQuestions.map(q => ({
            question_text: q.question_text,
            options: q.options,
            correct_answer: q.correct_answer,
            article_url: q.article_url,
            type: 'multiple_choice',
            status: 'available'
          }))
        );

      if (error) throw error;

      toast({
        title: "Succès",
        description: `${parsedQuestions.length} question(s) ajoutée(s) avec succès`,
      });

      setBulkText('');
    } catch (error) {
      console.error('Error adding questions:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter les questions",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajout rapide de questions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
          placeholder={`Format attendu:

Question 1:
Votre question ici ?

A) Option 1
B) Option 2
C) Option 3
D) Option 4

Réponse correcte: B) La bonne réponse

https://... (lien de l'article)`}
          className="min-h-[300px]"
        />
        <Button onClick={handleSubmit} className="w-full">
          Ajouter les questions
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickAddQuestion;