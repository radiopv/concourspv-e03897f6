import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, History } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface QuestionCardProps {
  question: {
    id: string;
    question_text: string;
    options: string[];
    correct_answer: string;
    article_url?: string;
    status: 'available' | 'used';
    last_used_date?: string;
    last_used_contest?: string;
  };
  isSelected: boolean;
  onSelect: () => void;
}

export const QuestionCard = ({ question, isSelected, onSelect }: QuestionCardProps) => {
  return (
    <Card className={`
      ${isSelected ? 'border-primary' : ''}
      ${question.status === 'used' ? 'bg-gray-50' : ''}
    `}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="font-medium">{question.question_text}</p>
            <ul className="mt-2 space-y-1">
              {question.options.map((option, index) => (
                <li 
                  key={index} 
                  className={option === question.correct_answer ? "text-green-600" : ""}
                >
                  {option}
                </li>
              ))}
            </ul>
            {question.article_url && (
              <a
                href={question.article_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-sm text-primary flex items-center gap-1 hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                Article source
              </a>
            )}
            {question.status === 'used' && question.last_used_date && (
              <div className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                <History className="w-4 h-4" />
                Dernière utilisation : {format(new Date(question.last_used_date), 'dd MMMM yyyy', { locale: fr })}
                {question.last_used_contest && (
                  <span className="ml-1">
                    dans "{question.last_used_contest}"
                  </span>
                )}
              </div>
            )}
          </div>
          <Button
            variant="outline"
            onClick={onSelect}
          >
            {isSelected ? 'Désélectionner' : 'Sélectionner'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};