import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

interface QuestionFormProps {
  question: {
    id: string;
    question_text: string;
    options: string[];
    correct_answer: string;
    article_url?: string;
    type: string;
  };
  onSave: (question: any) => void;
  onCancel: () => void;
}

const QuestionForm = ({ question, onSave, onCancel }: QuestionFormProps) => {
  const [formData, setFormData] = React.useState({
    question_text: question.question_text,
    options: [...question.options],
    correct_answer: question.correct_answer,
    article_url: question.article_url || '',
    type: question.type || 'multiple_choice',
  });

  return (
    <div className="space-y-4">
      <div>
        <Label>Question</Label>
        <Input
          value={formData.question_text}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            question_text: e.target.value
          }))}
        />
      </div>

      <div>
        <Label>Lien de l'article</Label>
        <Input
          value={formData.article_url}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            article_url: e.target.value
          }))}
          placeholder="https://..."
        />
      </div>

      {formData.options.map((option, optionIndex) => (
        <div key={optionIndex}>
          <Label>Option {optionIndex + 1}</Label>
          <Input
            value={option}
            onChange={(e) => {
              const newOptions = [...formData.options];
              newOptions[optionIndex] = e.target.value;
              setFormData(prev => ({
                ...prev,
                options: newOptions
              }));
            }}
          />
        </div>
      ))}

      <div>
        <Label>Réponse correcte</Label>
        <Input
          value={formData.correct_answer}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            correct_answer: e.target.value
          }))}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={() => onSave(formData)} className="flex items-center gap-2">
          <Save className="w-4 h-4" /> Enregistrer
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex items-center gap-2">
          <X className="w-4 h-4" /> Annuler
        </Button>
      </div>
    </div>
  );
};

export default QuestionForm;