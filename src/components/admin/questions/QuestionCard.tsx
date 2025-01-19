import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Save, X } from "lucide-react";

interface QuestionCardProps {
  question: {
    id: string;
    question_text: string;
    options: string[];
    correct_answer: string;
    article_url?: string;
  };
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSave: (updatedQuestion: any) => void;
  onCancel: () => void;
}

const QuestionCard = ({
  question,
  isEditing,
  onEdit,
  onDelete,
  onSave,
  onCancel
}: QuestionCardProps) => {
  const [editedQuestion, setEditedQuestion] = useState(question);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...editedQuestion.options];
    newOptions[index] = value;
    setEditedQuestion({ ...editedQuestion, options: newOptions });
  };

  if (isEditing) {
    return (
      <Card>
        <CardContent className="p-4 space-y-4">
          <Input
            value={editedQuestion.question_text}
            onChange={(e) => setEditedQuestion({ ...editedQuestion, question_text: e.target.value })}
            placeholder="Question"
          />
          {editedQuestion.options.map((option, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
              />
              <Button
                variant={option === editedQuestion.correct_answer ? "default" : "outline"}
                onClick={() => setEditedQuestion({ ...editedQuestion, correct_answer: option })}
              >
                Correcte
              </Button>
            </div>
          ))}
          <Input
            value={editedQuestion.article_url || ''}
            onChange={(e) => setEditedQuestion({ ...editedQuestion, article_url: e.target.value })}
            placeholder="URL de l'article"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button onClick={() => onSave(editedQuestion)}>
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold">{question.question_text}</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <p
              key={index}
              className={option === question.correct_answer ? "text-green-600 font-medium" : ""}
            >
              {option}
            </p>
          ))}
        </div>
        {question.article_url && (
          <a
            href={question.article_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline mt-2 inline-block"
          >
            Voir l'article
          </a>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;