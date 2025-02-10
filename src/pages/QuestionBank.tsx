
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import QuestionBankList from "@/components/admin/question-bank/QuestionBankList";
import AddQuestionForm from "@/components/admin/question-bank/AddQuestionForm";
import { supabase } from "@/lib/supabase";

const QuestionBank = () => {
  const { data: questions, isLoading } = useQuery({
    queryKey: ['question-bank'],
    queryFn: async () => {
      console.log('Fetching all questions from question bank...');
      
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching questions:', error);
        throw error;
      }

      console.log('Raw questions data:', data);
      console.log('Total questions in database:', data?.length);

      if (!data) return [];

      // Valider les questions
      const validatedQuestions = data.map(question => ({
        id: question.id,
        question_text: question.question_text || '',
        options: Array.isArray(question.options) ? question.options : [],
        correct_answer: question.correct_answer || '',
        article_url: question.article_url || '',
        type: question.type || 'multiple_choice',
        status: question.status || 'available',
        contest_id: question.contest_id,
        created_at: question.created_at,
        updated_at: question.updated_at
      }));

      console.log('Validated questions:', validatedQuestions);
      return validatedQuestions;
    },
    staleTime: 1000,
    refetchOnWindowFocus: true
  });

  if (isLoading) {
    return <div>Chargement des questions...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Banque de Questions ({questions?.length || 0} questions)</CardTitle>
        </CardHeader>
        <CardContent>
          <AddQuestionForm />
          <div className="mt-4">
            <Button variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une Question
            </Button>
          </div>
        </CardContent>
      </Card>
      <QuestionBankList />
    </div>
  );
};

export default QuestionBank;
