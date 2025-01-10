import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QuestionForm from './QuestionForm';

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  article_url?: string;
  image_url?: string;
}

interface QuestionListProps {
  questions: Question[];
  onEdit: (id: string, data: any) => void;
  onDelete: (id: string) => void;
}

const QuestionList = ({ questions, onEdit, onDelete }: QuestionListProps) => {
  const [editingId, setEditingId] = React.useState<string | null>(null);

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <Card key={question.id}>
          <CardContent className="pt-6">
            {editingId === question.id ? (
              <QuestionForm
                initialQuestion={question}
                onSubmit={(data) => {
                  onEdit(question.id, data);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
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
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setEditingId(question.id)}>
                      Modifier
                    </Button>
                    <Button variant="destructive" onClick={() => onDelete(question.id)}>
                      Supprimer
                    </Button>
                  </div>
                </div>

                {question.image_url && (
                  <img
                    src={question.image_url}
                    alt="Question"
                    className="mt-2 max-h-40 rounded-lg"
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuestionList;