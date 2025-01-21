import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Save, X } from "lucide-react";
import QuestionForm from './QuestionForm';
import { Question } from '@/types/database';

interface QuestionCardProps {
  question: Question;
  isEditing: boolean;
  contestId: string; // Add contestId to props
  onEdit: () => void;
  onDelete: () => void;
  onSave: (updatedQuestion: Omit<Question, "id">) => void;
  onCancel: () => void;
}

const QuestionCard = ({
  question,
  isEditing,
  contestId,
  onEdit,
  onDelete,
  onSave,
  onCancel
}: QuestionCardProps) => {
  if (isEditing) {
    return (
      <Card>
        <CardContent className="p-4">
          <QuestionForm
            initialQuestion={question}
            contestId={contestId}
            onSubmit={onSave}
            onCancel={onCancel}
          />
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