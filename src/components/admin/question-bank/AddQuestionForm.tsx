import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../App";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AddQuestionForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [questionText, setQuestionText] = useState("");

  const parseQuestionText = (text: string) => {
    try {
      // Parse question
      const questionMatch = text.match(/Question :\s*(.+?)(?=\s*\n|$)/s);
      const question = questionMatch ? questionMatch[1].trim() : "";

      // Parse options
      const optionsText = text.match(/Choix de réponse :\s*([\s\S]*?)(?=\s*Réponse correcte|$)/);
      const options = optionsText ? optionsText[1]
        .split('\n')
        .filter(line => line.trim().match(/^[A-D]\)/))
        .map(line => line.replace(/^[A-D]\)\s*/, '').trim()) : [];

      // Parse correct answer
      const correctAnswerMatch = text.match(/Réponse correcte :\s*([A-D]\).*?)(?=\s*voici l'url|$)/);
      const correctAnswer = correctAnswerMatch 
        ? correctAnswerMatch[1].replace(/^[A-D]\)\s*/, '').trim()
        : "";

      // Parse URL
      const urlMatch = text.match(/voici l'url :\s*(https?:\/\/[^\s]+)/);
      const articleUrl = urlMatch ? urlMatch[1].trim() : "";

      return {
        question_text: question,
        options,
        correct_answer: correctAnswer,
        article_url: articleUrl
      };
    } catch (error) {
      console.error("Error parsing question:", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedQuestion = parseQuestionText(questionText);
    
    if (!parsedQuestion) {
      toast({
        title: "Erreur",
        description: "Le format de la question n'est pas valide",
        variant: "destructive",
      });
      return;
    }

    if (!parsedQuestion.question_text || 
        parsedQuestion.options.length !== 4 || 
        !parsedQuestion.correct_answer) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('question_bank')
        .insert([{
          question_text: parsedQuestion.question_text,
          options: parsedQuestion.options,
          correct_answer: parsedQuestion.correct_answer,
          article_url: parsedQuestion.article_url || null,
          status: 'available'
        }]);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['question-bank'] });
      
      toast({
        title: "Succès",
        description: "La question a été ajoutée à la banque",
      });

      setQuestionText("");
    } catch (error) {
      console.error('Error adding question:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la question",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajouter une question</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="question">Collez votre question ici</Label>
            <Textarea
              id="question"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Question :
Choix de réponse :
A) ...
B) ...
C) ...
D) ...
Réponse correcte :
URL :"
              className="min-h-[300px]"
            />
          </div>

          <Button type="submit" className="w-full">
            Ajouter la question
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddQuestionForm;