import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../App";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";

const AddQuestionForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    question_text: "",
    options: ["", "", "", ""],
    correct_answer: "",
    article_url: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
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
        .from('question_bank')
        .insert([{
          question_text: formData.question_text,
          options: formData.options,
          correct_answer: formData.correct_answer,
          article_url: formData.article_url || null,
          status: 'available'
        }]);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['question-bank'] });
      
      toast({
        title: "Succès",
        description: "La question a été ajoutée à la banque",
      });

      setFormData({
        question_text: "",
        options: ["", "", "", ""],
        correct_answer: "",
        article_url: ""
      });
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
        <CardTitle>Ajouter une question manuellement</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              value={formData.question_text}
              onChange={(e) => setFormData(prev => ({ ...prev, question_text: e.target.value }))}
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
                  setFormData(prev => ({ ...prev, options: newOptions }));
                }}
                placeholder={`Option ${index + 1}`}
              />
            ))}
          </div>

          <div>
            <Label htmlFor="correct">Réponse correcte</Label>
            <Input
              id="correct"
              value={formData.correct_answer}
              onChange={(e) => setFormData(prev => ({ ...prev, correct_answer: e.target.value }))}
              placeholder="Entrez la réponse correcte"
            />
          </div>

          <div>
            <Label htmlFor="article">Lien de l'article (optionnel)</Label>
            <Input
              id="article"
              value={formData.article_url}
              onChange={(e) => setFormData(prev => ({ ...prev, article_url: e.target.value }))}
              placeholder="https://..."
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