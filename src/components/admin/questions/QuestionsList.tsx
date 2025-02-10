
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Plus } from "lucide-react";
import QuestionCard from './QuestionCard';
import { Question } from '@/types/database';

interface QuestionsListProps {
  contestId: string;
}

const QuestionsList = ({ contestId }: QuestionsListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingQuestionId, setEditingQuestionId] = React.useState<string | null>(null);

  const { data: questions, isLoading, error } = useQuery({
    queryKey: ['questions', contestId],
    queryFn: async () => {
      console.log('Fetching questions for contest:', contestId);
      
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('contest_id', contestId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching questions:', error);
        throw error;
      }

      console.log('Questions fetched:', data?.length);
      console.log('Raw questions data:', data);

      if (!data) return [];

      // Validation des questions
      const validatedQuestions = data.map(question => ({
        id: question.id,
        question_text: question.question_text || '',
        options: Array.isArray(question.options) ? question.options : 
                typeof question.options === 'object' ? Object.values(question.options) : 
                [],
        correct_answer: question.correct_answer || '',
        article_url: question.article_url || '',
        type: question.type || 'multiple_choice',
        status: question.status || 'available',
        order_number: question.order_number || 0,
        contest_id: question.contest_id,
        created_at: question.created_at,
        updated_at: question.updated_at
      }));

      console.log('Validated questions:', validatedQuestions);
      return validatedQuestions;
    },
    staleTime: 1000,
    refetchInterval: 5000, // Rafraîchir toutes les 5 secondes
    refetchOnWindowFocus: true
  });

  if (error) {
    console.error('Query error:', error);
    toast({
      title: "Erreur",
      description: "Impossible de charger les questions",
      variant: "destructive",
    });
  }

  const handleAddQuestion = async () => {
    try {
      const { error } = await supabase
        .from('questions')
        .insert([{
          contest_id: contestId,
          question_text: "Nouvelle question",
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          correct_answer: "Option 1",
          order_number: (questions?.length || 0) + 1,
          type: 'multiple_choice',
          article_url: '',
          status: 'available'
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
      const { error } = await supabase
        .from('questions')
        .update(updatedQuestion)
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
        <CardTitle>Questions du concours ({questions?.length || 0} questions)</CardTitle>
        <Button
          onClick={handleAddQuestion}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Ajouter une question
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {questions && questions.length > 0 ? (
          questions.map((question: Question) => (
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
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            Aucune question trouvée pour ce concours
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionsList;
