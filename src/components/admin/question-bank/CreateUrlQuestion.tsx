import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { Link, ExternalLink } from "lucide-react";

const CreateUrlQuestion = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    question_text: '',
    options: ['', '', '', ''],
    correct_answer: '',
    article_url: '',
  });

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.question_text || formData.options.some(opt => !opt) || !formData.correct_answer || !url) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      const { error } = await supabase
        .from('question_bank')
        .insert([{
          question_text: formData.question_text,
          options: formData.options,
          correct_answer: formData.correct_answer,
          article_url: url,
          status: 'available'
        }]);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['questions-list'] });
      
      toast({
        title: "Succès",
        description: "Question ajoutée à la banque de questions",
      });

      // Reset form
      setFormData({
        question_text: '',
        options: ['', '', '', ''],
        correct_answer: '',
        article_url: '',
      });
      setUrl('');

    } catch (error) {
      console.error('Error adding question:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible d'ajouter la question",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Créer une question basée sur une URL
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="url">URL de l'article</Label>
            <div className="flex gap-2">
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1"
              />
              {url && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.open(url, '_blank')}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Voir
                </Button>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              value={formData.question_text}
              onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
              placeholder="Entrez votre question..."
            />
          </div>

          <div className="space-y-2">
            <Label>Options de réponse</Label>
            {formData.options.map((option, index) => (
              <Input
                key={index}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
              />
            ))}
          </div>

          <div>
            <Label htmlFor="correct">Réponse correcte</Label>
            <Input
              id="correct"
              value={formData.correct_answer}
              onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
              placeholder="Entrez la réponse correcte"
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Création...' : 'Créer la question'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateUrlQuestion;