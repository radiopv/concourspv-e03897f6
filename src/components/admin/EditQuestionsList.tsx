import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../App";
import { Plus } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import QuestionAccordion from './questions/QuestionAccordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import QuestionBankList from './question-bank/QuestionBankList';

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
  const [showQuestionBank, setShowQuestionBank] = useState(false);

  const { data: questions, isLoading } = useQuery({
    queryKey: ['questions', contestId],
    queryFn: async () => {
      console.log('Fetching questions for contest:', contestId);
      
      // First get the questionnaire for this contest
      const { data: questionnaire, error: questionnaireError } = await supabase
        .from('questionnaires')
        .select('id')
        .eq('contest_id', contestId)
        .maybeSingle();
      
      if (questionnaireError) {
        console.error('Error fetching questionnaire:', questionnaireError);
        throw questionnaireError;
      }

      // If no questionnaire exists, return empty array
      if (!questionnaire) {
        console.log('No questionnaire found for contest:', contestId);
        return [];
      }

      console.log('Found questionnaire:', questionnaire);

      // Then get the questions for this questionnaire
      const { data, error } = await supabase
        .from('questions')
        .select('id, question_text, options, correct_answer, article_url, type')
        .eq('questionnaire_id', questionnaire.id)
        .order('created_at');
      
      if (error) {
        console.error('Error fetching questions:', error);
        throw error;
      }

      console.log('Fetched questions:', data);
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

  const handleAddFromBank = async (bankQuestions: any[]) => {
    try {
      // First get or create the questionnaire
      let questionnaireId;
      const { data: existingQuestionnaire, error: questionnaireError } = await supabase
        .from('questionnaires')
        .select('id')
        .eq('contest_id', contestId)
        .single();
      
      if (questionnaireError) {
        // Create new questionnaire if none exists
        const { data: newQuestionnaire, error: createError } = await supabase
          .from('questionnaires')
          .insert([{
            contest_id: contestId,
            title: "Questionnaire du concours",
          }])
          .select()
          .single();
        
        if (createError) throw createError;
        questionnaireId = newQuestionnaire.id;
      } else {
        questionnaireId = existingQuestionnaire.id;
      }

      // Add selected questions to the questionnaire
      const questionsToAdd = bankQuestions.map(q => ({
        questionnaire_id: questionnaireId,
        question_text: q.question_text,
        options: q.options,
        correct_answer: q.correct_answer,
        article_url: q.article_url,
        type: 'multiple_choice'
      }));

      const { error } = await supabase
        .from('questions')
        .insert(questionsToAdd);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
      toast({
        title: "Succès",
        description: `${bankQuestions.length} questions ont été ajoutées`,
      });
      
      setShowQuestionBank(false);
    } catch (error) {
      console.error('Error adding questions from bank:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter les questions",
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
        <Dialog open={showQuestionBank} onOpenChange={setShowQuestionBank}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Ajouter des questions
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Sélectionner des questions</DialogTitle>
            </DialogHeader>
            <QuestionBankList 
              questions={[]} 
              onAddToContest={handleAddFromBank}
              mode="selection"
            />
          </DialogContent>
        </Dialog>
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