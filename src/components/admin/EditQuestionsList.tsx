import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../App";
import { Pencil, Save, Trash2, X } from "lucide-react";

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
  const [editForm, setEditForm] = useState<Question | null>(null);

  const { data: questions, isLoading } = useQuery({
    queryKey: ['questions', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('contest_id', contestId)
        .order('order_number');
      
      if (error) throw error;
      return data as Question[];
    }
  });

  const handleEdit = (question: Question) => {
    setEditingQuestionId(question.id);
    setEditForm(question);
  };

  const handleCancelEdit = () => {
    setEditingQuestionId(null);
    setEditForm(null);
  };

  const handleSaveEdit = async () => {
    if (!editForm) return;

    try {
      const { error } = await supabase
        .from('questions')
        .update({
          question_text: editForm.question_text,
          options: editForm.options,
          correct_answer: editForm.correct_answer,
          article_url: editForm.article_url
        })
        .eq('id', editForm.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
      toast({
        title: "Succès",
        description: "La question a été mise à jour",
      });
      
      setEditingQuestionId(null);
      setEditForm(null);
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
              <div className="space-y-4">
                <div>
                  <Label>Question</Label>
                  <Input
                    value={editForm?.question_text || ''}
                    onChange={(e) => setEditForm(prev => prev ? {
                      ...prev,
                      question_text: e.target.value
                    } : null)}
                  />
                </div>

                <div>
                  <Label>Lien de l'article</Label>
                  <Input
                    value={editForm?.article_url || ''}
                    onChange={(e) => setEditForm(prev => prev ? {
                      ...prev,
                      article_url: e.target.value
                    } : null)}
                  />
                </div>

                {editForm?.options.map((option, optionIndex) => (
                  <div key={optionIndex}>
                    <Label>Option {optionIndex + 1}</Label>
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...editForm.options];
                        newOptions[optionIndex] = e.target.value;
                        setEditForm(prev => prev ? {
                          ...prev,
                          options: newOptions
                        } : null);
                      }}
                    />
                  </div>
                ))}

                <div>
                  <Label>Réponse correcte</Label>
                  <Input
                    value={editForm?.correct_answer || ''}
                    onChange={(e) => setEditForm(prev => prev ? {
                      ...prev,
                      correct_answer: e.target.value
                    } : null)}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveEdit} className="flex items-center gap-2">
                    <Save className="w-4 h-4" /> Enregistrer
                  </Button>
                  <Button variant="outline" onClick={handleCancelEdit} className="flex items-center gap-2">
                    <X className="w-4 h-4" /> Annuler
                  </Button>
                </div>
              </div>
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
                      onClick={() => handleEdit(question)}
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