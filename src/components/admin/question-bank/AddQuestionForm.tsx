import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Minus } from "lucide-react";

interface ParsedQuestion {
  question_text: string;
  options: string[];
  correct_answer: string;
  article_url?: string;
}

const AddQuestionForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [bulkText, setBulkText] = useState('');
  const [formData, setFormData] = useState({
    question_text: "",
    options: ["", "", "", ""],
    correct_answer: "",
    article_url: ""
  });

  const parseQuestionText = (text: string): ParsedQuestion[] => {
    const questions: ParsedQuestion[] = [];
    const questionBlocks = text.split(/Question \d+:/g).filter(block => block.trim());
    
    for (const block of questionBlocks) {
      try {
        // Extraire l'URL source à la fin du texte
        const urlMatch = text.match(/https?:\/\/[^\s]+$/m);
        const article_url = urlMatch ? urlMatch[0].trim() : undefined;

        // Extraire la question
        const questionMatch = block.match(/([^\n]+)/);
        if (!questionMatch) continue;
        const question_text = questionMatch[1].trim();

        // Extraire les options
        const options: string[] = [];
        const optionsMatches = block.matchAll(/[A-D]\) ([^\n]+)/g);
        for (const match of optionsMatches) {
          options.push(match[1].trim());
        }

        // Extraire la réponse correcte
        const correctMatch = block.match(/Réponse correcte: [A-D]\) ([^\n]+)/);
        if (!correctMatch) continue;
        const correct_answer = correctMatch[1].trim();

        if (question_text && options.length === 4 && correct_answer) {
          questions.push({
            question_text,
            options,
            correct_answer,
            article_url
          });
        }
      } catch (error) {
        console.error('Error parsing question block:', error);
        continue;
      }
    }

    return questions;
  };

  const handleBulkSubmit = async () => {
    const parsedQuestions = parseQuestionText(bulkText);
    
    if (parsedQuestions.length === 0) {
      toast({
        title: "Erreur de format",
        description: "Le format des questions n'est pas valide. Veuillez vérifier la structure.",
        variant: "destructive",
      });
      return;
    }

    try {
      for (const question of parsedQuestions) {
        const { error } = await supabase
          .from('questions')
          .insert([{
            question_text: question.question_text,
            options: question.options,
            correct_answer: question.correct_answer,
            article_url: question.article_url,
            type: 'multiple_choice',
            status: 'available'
          }]);

        if (error) throw error;
      }

      toast({
        title: "Succès",
        description: `${parsedQuestions.length} question(s) ajoutée(s) avec succès`,
      });

      setBulkText('');
      queryClient.invalidateQueries({ queryKey: ['questions-bank'] });
    } catch (error) {
      console.error('Error adding questions:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter les questions",
        variant: "destructive",
      });
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question_text || formData.options.some(opt => !opt) || !formData.correct_answer) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('questions')
        .insert([{
          question_text: formData.question_text,
          options: formData.options,
          correct_answer: formData.correct_answer,
          article_url: formData.article_url || null,
          type: 'multiple_choice',
          status: 'available'
        }]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Question ajoutée avec succès",
      });

      setFormData({
        question_text: "",
        options: ["", "", "", ""],
        correct_answer: "",
        article_url: ""
      });

      queryClient.invalidateQueries({ queryKey: ['questions-bank'] });
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ajout rapide de questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
            <Button onClick={handleBulkSubmit} className="w-full">
              Ajouter les questions
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ajout manuel d'une question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <Label>Question</Label>
              <Input
                value={formData.question_text}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  question_text: e.target.value
                }))}
                placeholder="Entrez la question"
              />
            </div>

            <div className="space-y-2">
              <Label>Options</Label>
              {formData.options.map((option, index) => (
                <Input
                  key={index}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...formData.options];
                    newOptions[index] = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      options: newOptions
                    }));
                  }}
                  placeholder={`Option ${index + 1}`}
                />
              ))}
            </div>

            <div>
              <Label>Réponse correcte</Label>
              <Input
                value={formData.correct_answer}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  correct_answer: e.target.value
                }))}
                placeholder="Entrez la réponse correcte"
              />
            </div>

            <div>
              <Label>Lien de l'article (optionnel)</Label>
              <Input
                value={formData.article_url}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  article_url: e.target.value
                }))}
                placeholder="https://..."
              />
            </div>

            <Button type="submit" className="w-full">
              Ajouter la question
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddQuestionForm;