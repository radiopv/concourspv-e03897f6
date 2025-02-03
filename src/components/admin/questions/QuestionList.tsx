import React from 'react';
import { Question } from '@/types/database';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface QuestionListProps {
  questions: Question[];
  contestId: string;
  onEdit: (question: Question) => void;
  onDelete: (questionId: string) => Promise<void>;
}

export const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  contestId,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <Card key={question.id} className="relative">
          <CardContent className="p-6">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="font-semibold mb-2">{question.question_text}</h3>
                {question.image_url && (
                  <div className="mb-4">
                    <img 
                      className="w-full max-w-md rounded-lg" 
                      src={question.image_url} 
                      alt="Question" 
                    />
                  </div>
                )}
                <div className="space-y-2">
                  {Array.isArray(question.options) && question.options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded ${
                        option === question.correct_answer
                          ? 'bg-green-100 border border-green-300'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
                {question.article_url && (
                  <a
                    href={question.article_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline mt-2 block"
                  >
                    Article source
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(question)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(question.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuestionList;