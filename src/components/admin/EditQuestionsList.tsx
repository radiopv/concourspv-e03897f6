import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Plus } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import QuestionAccordion from './questions/QuestionAccordion';

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
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);

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

  const handleDelete = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
      await queryClient.invalidateQueries({ queryKey: ['contests'] });
      
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
          type: 'multiple_choice'
        }]);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
      await queryClient.invalidateQueries({ queryKey: ['contests'] });
      
      toast({
        title: "Succès",
        description: "La question a été ajoutée",
      });
      
      setIsAddingQuestion(false);
    } catch (error) {
      console.error('Error adding question:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la question",
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
      <CardContent>
        <Accordion type="multiple" className="space-y-2">
          {questions?.map((question, index) => (
            <QuestionAccordion
              key={question.id}
              question={question}
              index={index}
              onDelete={handleDelete}
              onUpdate={async () => {
                await queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
                await queryClient.invalidateQueries({ queryKey: ['contests'] });
              }}
            />
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default EditQuestionsList;
