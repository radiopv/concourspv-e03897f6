import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

interface QuestionEditFormProps {
  formData: {
    question_text: string;
    options: string[];
    correct_answer: string;
    article_url: string;
  };
  onFormChange: (field: string, value: string | string[]) => void;
  onSave: () => void;
  onCancel: () => void;
}

const QuestionEditForm = ({ formData, onFormChange, onSave, onCancel }: QuestionEditFormProps) => {
  return (
    <div className="space-y-4 p-4">
      <div>
        <label className="text-sm font-medium">Question</label>
        <Input
          value={formData.question_text}
          onChange={(e) => onFormChange('question_text', e.target.value)}
          placeholder="Texte de la question"
        />
      </div>

      <div>
        <label className="text-sm font-medium">URL de l'article</label>
        <Input
          value={formData.article_url}
          onChange={(e) => onFormChange('article_url', e.target.value)}
          placeholder="https://..."
        />
      </div>

      {formData.options.map((option, optionIndex) => (
        <div key={optionIndex}>
          <label className="text-sm font-medium">
            Option {optionIndex + 1}
            {option === formData.correct_answer && (
              <span className="text-green-600 ml-2">(Réponse correcte)</span>
            )}
          </label>
          <div className="flex gap-2">
            <Input
              value={option}
              onChange={(e) => {
                const newOptions = [...formData.options];
                newOptions[optionIndex] = e.target.value;
                onFormChange('options', newOptions);
              }}
            />
            <Button
              variant="outline"
              onClick={() => onFormChange('correct_answer', option)}
              className={option === formData.correct_answer ? "bg-green-50" : ""}
            >
              ✓
            </Button>
          </div>
        </div>
      ))}

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" /> Annuler
        </Button>
        <Button onClick={onSave}>
          <Save className="w-4 h-4 mr-2" /> Enregistrer
        </Button>
      </div>
    </div>
  );
};

export default QuestionEditForm;