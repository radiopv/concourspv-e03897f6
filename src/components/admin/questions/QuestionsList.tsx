import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Plus } from "lucide-react";
import QuestionCard from './QuestionCard';

const QuestionsList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  const { data: questions, isLoading } = useQuery({
    queryKey: ['questions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleAddQuestion = async () => {
    try {
      const { error } = await supabase
        .from('questions')
        .insert([{
          question_text: "Nouvelle question",
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          correct_answer: "Option 1",
          type: 'multiple_choice'
        }]);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['questions'] });
      
      toast({
        title: "Succès",
        description: "La question a été ajoutée",
      });
    } catch (error) {
      console.error('Error adding question:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la question",
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

      await queryClient.invalidateQueries({ queryKey: ['questions'] });
      
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

  const handleSave = async (questionId: string, updatedQuestion: any) => {
    try {
      const { error } = await supabase
        .from('questions')
        .update(updatedQuestion)
        .eq('id', questionId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['questions'] });
      setEditingQuestionId(null);
      
      toast({
        title: "Succès",
        description: "La question a été mise à jour",
      });
    } catch (error) {
      console.error('Error updating question:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la question",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Chargement des questions...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion des questions</CardTitle>
        <Button
          onClick={handleAddQuestion}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Ajouter une question
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {questions?.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            isEditing={editingQuestionId === question.id}
            onEdit={() => setEditingQuestionId(question.id)}
            onDelete={() => handleDelete(question.id)}
            onSave={(updatedQuestion) => handleSave(question.id, updatedQuestion)}
            onCancel={() => setEditingQuestionId(null)}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default QuestionsList;