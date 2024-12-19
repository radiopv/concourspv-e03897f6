import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Edit, Trash2 } from "lucide-react";
import QuestionForm from '../QuestionForm';

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  article_url?: string;
}

interface QuestionBankListProps {
  questions: Question[];
}

const QuestionBankList = ({ questions }: QuestionBankListProps) => {
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from('question_bank')
        .delete()
        .eq('id', questionId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['question-bank'] });
      toast({
        title: "Question supprimée",
        description: "La question a été supprimée avec succès",
      });
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la question",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (updatedQuestion: any) => {
    try {
      const { error } = await supabase
        .from('question_bank')
        .update({
          question_text: updatedQuestion.question_text,
          options: updatedQuestion.options,
          correct_answer: updatedQuestion.correct_answer,
          article_url: updatedQuestion.article_url,
        })
        .eq('id', editingQuestion?.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['question-bank'] });
      toast({
        title: "Question mise à jour",
        description: "La question a été mise à jour avec succès",
      });
      setEditingQuestion(null);
    } catch (error) {
      console.error('Error updating question:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la question",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <Card key={question.id}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-4 flex-1">
                <p className="font-medium">{question.question_text}</p>
                <ul className="list-disc list-inside space-y-2">
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
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Article lié
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setEditingQuestion(question)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(question.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {editingQuestion && (
        <Dialog open={true} onOpenChange={() => setEditingQuestion(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier la question</DialogTitle>
            </DialogHeader>
            <QuestionForm
              question={editingQuestion}
              onSave={handleSave}
              onCancel={() => setEditingQuestion(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default QuestionBankList;