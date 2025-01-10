import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import QuestionForm from './QuestionForm';

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
  return (
    <Card className="p-4">
      {isEditing ? (
        <QuestionForm
          initialQuestion={question}
          onSubmit={onSave}
          onCancel={onCancel}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{question.question_text}</h3>
              <div className="mt-2">
                {question.options.map((option, index) => (
                  <p key={index} className={option === question.correct_answer ? "text-green-600" : ""}>
                    {option}
                  </p>
                ))}
              </div>
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
          {question.article_url && (
            <a
              href={question.article_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline block"
            >
              Lien vers l'article
            </a>
          )}
        </div>
      )}
    </Card>
  );
};

export default QuestionCard;