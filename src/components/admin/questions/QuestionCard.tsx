import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, Save, X } from "lucide-react";

interface QuestionCardProps {
  question: {
    id: string;
    question_text: string;
    options: string[];
    correct_answer: string;
    article_url?: string;
    image_url?: string;
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
  const [editedQuestion, setEditedQuestion] = useState({
    ...question
  });

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...editedQuestion.options];
    newOptions[index] = value;
    setEditedQuestion({ ...editedQuestion, options: newOptions });
  };

  return (
    <Card className="p-4">
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <Label>Question</Label>
            <Input
              value={editedQuestion.question_text}
              onChange={(e) => setEditedQuestion({ 
                ...editedQuestion, 
                question_text: e.target.value 
              })}
            />
          </div>

          <div>
            <Label>URL de l'article</Label>
            <Input
              value={editedQuestion.article_url || ''}
              onChange={(e) => setEditedQuestion({ 
                ...editedQuestion, 
                article_url: e.target.value 
              })}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label>Options</Label>
            {editedQuestion.options.map((option, index) => (
              <Input
                key={index}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
            ))}
          </div>

          <div>
            <Label>Réponse correcte</Label>
            <Input
              value={editedQuestion.correct_answer}
              onChange={(e) => setEditedQuestion({ 
                ...editedQuestion, 
                correct_answer: e.target.value 
              })}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button onClick={() => onSave(editedQuestion)} className="flex items-center gap-2">
              <Save className="w-4 h-4" /> Enregistrer
            </Button>
            <Button variant="outline" onClick={onCancel} className="flex items-center gap-2">
              <X className="w-4 h-4" /> Annuler
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h3 className="font-semibold">{question.question_text}</h3>
              <div className="mt-2">
                {question.options.map((option, index) => (
                  <p 
                    key={index} 
                    className={option === question.correct_answer ? "text-green-600" : ""}
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
                  className="text-blue-500 hover:underline flex items-center gap-1 mt-2"
                >
                  Voir l'article <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onEdit}>
                Modifier
              </Button>
              <Button variant="destructive" onClick={onDelete}>
                Supprimer
              </Button>
            </div>
          </div>
          {question.image_url && (
            <img
              src={question.image_url}
              alt="Question"
              className="rounded-lg max-h-48 object-cover"
            />
          )}
        </div>
      )}
    </Card>
  );
};

export default QuestionCard;