import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../App";
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
  type: string;
}

const EditQuestionsList = ({ contestId }: EditQuestionsListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);

  const { data: questions, isLoading } = useQuery({
    queryKey: ['questions', contestId],
    queryFn: async () => {
      // First get the questionnaire for this contest
      const { data: questionnaire, error: questionnaireError } = await supabase
        .from('questionnaires')
        .select('id')
        .eq('contest_id', contestId)
        .maybeSingle();
      
      if (questionnaireError) throw questionnaireError;

      // If no questionnaire exists, return empty array
      if (!questionnaire) {
        return [];
      }

      // Then get the questions for this questionnaire
      const { data, error } = await supabase
        .from('questions')
        .select('id, question_text, options, correct_answer, article_url, order_number, type')
        .eq('questionnaire_id', questionnaire.id)
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

  const handleAddQuestion = async () => {
    try {
      // First get the questionnaire id
      const { data: questionnaire, error: questionnaireError } = await supabase
        .from('questionnaires')
        .select('id')
        .eq('contest_id', contestId)
        .single();
      
      if (questionnaireError) {
        // If no questionnaire exists, create one
        const { data: newQuestionnaire, error: createError } = await supabase
          .from('questionnaires')
          .insert([{
            contest_id: contestId,
            title: "Questionnaire du concours",
          }])
          .select()
          .single();
        
        if (createError) throw createError;
        
        const { error } = await supabase
          .from('questions')
          .insert([{
            questionnaire_id: newQuestionnaire.id,
            question_text: "Nouvelle question",
            options: ["Option 1", "Option 2", "Option 3", "Option 4"],
            correct_answer: "Option 1",
            order_number: (questions?.length || 0) + 1,
            type: 'multiple_choice'
          }]);

        if (error) throw error;
      } else {
        // If questionnaire exists, add question to it
        const { error } = await supabase
          .from('questions')
          .insert([{
            questionnaire_id: questionnaire.id,
            question_text: "Nouvelle question",
            options: ["Option 1", "Option 2", "Option 3", "Option 4"],
            correct_answer: "Option 1",
            order_number: (questions?.length || 0) + 1,
            type: 'multiple_choice'
          }]);

        if (error) throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
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
              onUpdate={() => queryClient.invalidateQueries({ queryKey: ['questions', contestId] })}
            />
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default EditQuestionsList;