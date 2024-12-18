import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../App";
import { Pencil, Trash2 } from "lucide-react";
import QuestionForm from './QuestionForm';

interface EditQuestionsListProps {
  contestId: string;
}

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  article_url?: string;
}

const EditQuestionsList = ({ contestId }: EditQuestionsListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  const { data: questions, isLoading } = useQuery({
    queryKey: ['questions', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('id, question_text, options, correct_answer, article_url, order_number')
        .eq('contest_id', contestId)
        .order('order_number');
      
      if (error) throw error;
      return data as Question[];
    }
  });

  const handleSaveEdit = async (questionId: string, updatedData: Partial<Question>) => {
    try {
      const { error } = await supabase
        .from('questions')
        .update({
          question_text: updatedData.question_text,
          options: updatedData.options,
          correct_answer: updatedData.correct_answer,
          article_url: updatedData.article_url
        })
        .eq('id', questionId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
      toast({
        title: "Succès",
        description: "La question a été mise à jour",
      });
      
      setEditingQuestionId(null);
    } catch (error) {
      console.error('Error updating question:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la question",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
      toast({
        title: "Succès",
        description: "La question a été supprimée",
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

  if (isLoading) {
    return <div>Chargement des questions...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Questions du concours</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {questions?.map((question, index) => (
          <Card key={question.id} className="p-4">
            {editingQuestionId === question.id ? (
              <QuestionForm
                question={question}
                onSave={(updatedData) => handleSaveEdit(question.id, updatedData)}
                onCancel={() => setEditingQuestionId(null)}
              />
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">Question {index + 1}</h3>
                    <p>{question.question_text}</p>
                    {question.article_url && (
                      <a 
                        href={question.article_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-sm"
                      >
                        Lien de l'article
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditingQuestionId(question.id)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(question.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {question.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
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
              </div>
            )}
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default EditQuestionsList;