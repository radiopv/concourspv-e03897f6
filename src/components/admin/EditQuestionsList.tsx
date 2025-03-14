import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Plus } from "lucide-react";
import QuestionCard from './questions/QuestionCard';
import { Question } from '@/types/database';

interface QuestionsListProps {
  contestId: string;
}

const QuestionsList = ({ contestId }: QuestionsListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  const { data: questions, isLoading } = useQuery({
    queryKey: ['questions', contestId],
    queryFn: async () => {
      console.log('Fetching questions for contest:', contestId); // Debug log
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('contest_id', contestId)
        .order('order_number');
      
      if (error) throw error;
      console.log('Questions fetched:', data); // Debug log
      return data as Question[];
    }
  });

  const handleAddQuestion = async () => {
    try {
      console.log('Adding question for contest:', contestId); // Debug log
      const { error } = await supabase
        .from('questions')
        .insert([{
          contest_id: contestId,
          question_text: "Nouvelle question",
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          correct_answer: "Option 1",
          order_number: (questions?.length || 0) + 1,
          type: 'multiple_choice'
        }]);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
      
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

      await queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
      
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

  const handleSave = async (questionId: string, updatedQuestion: Omit<Question, "id">) => {
    try {
      console.log('Saving question with contest_id:', contestId); // Debug log
      const { error } = await supabase
        .from('questions')
        .update({
          ...updatedQuestion,
          contest_id: contestId
        })
        .eq('id', questionId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
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
        <CardTitle>Questions du concours</CardTitle>
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
            contestId={contestId}
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