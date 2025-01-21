import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Question } from '@/types/database';

export interface QuestionFormProps {
  initialQuestion?: {
    id?: string;
    question_text: string;
    options: string[];
    correct_answer: string;
    article_url?: string;
    image_url?: string;
  };
  contestId: string; // Ajout de la prop contestId
  onSubmit: (formData: Omit<Question, "id">) => void;
  onCancel?: () => void;
}

const QuestionForm = ({ initialQuestion, contestId, onSubmit, onCancel }: QuestionFormProps) => {
  const [formData, setFormData] = useState({
    question_text: initialQuestion?.question_text || '',
    options: initialQuestion?.options || ['', '', '', ''],
    correct_answer: initialQuestion?.correct_answer || '',
    article_url: initialQuestion?.article_url || '',
    image_url: initialQuestion?.image_url || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting question with contest_id:', contestId); // Debug log
    onSubmit({
      ...formData,
      type: 'multiple_choice' as const,
      contest_id: contestId
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="question">Question</Label>
        <Input
          id="question"
          value={formData.question_text}
          onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
          placeholder="Entrez votre question"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Options</Label>
        {formData.options.map((option, index) => (
          <Input
            key={index}
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            placeholder={`Option ${index + 1}`}
            required
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
          required
        />
      </div>

      <div>
        <Label htmlFor="article">URL de l'article (optionnel)</Label>
        <Input
          id="article"
          value={formData.article_url}
          onChange={(e) => setFormData({ ...formData, article_url: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button type="submit">
          {initialQuestion ? 'Mettre à jour' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
};

export default QuestionForm;