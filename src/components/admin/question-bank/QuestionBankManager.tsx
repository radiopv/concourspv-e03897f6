import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuestionBankList from "./QuestionBankList";
import AddQuestionForm from "./AddQuestionForm";
import QuestionGenerator from "./QuestionGenerator";
import UrlQuestionGenerator from "./UrlQuestionGenerator";
import { supabase } from "@/lib/supabase";

const QuestionBankManager = () => {
  const { data: questions, isLoading } = useQuery({
    queryKey: ['question-bank'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('question_bank')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="grid md:grid-cols-2 gap-6">
        <QuestionGenerator />
        <UrlQuestionGenerator />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Ajouter une question manuellement</CardTitle>
        </CardHeader>
        <CardContent>
          <AddQuestionForm />
        </CardContent>
      </Card>
      <QuestionBankList />
    </div>
  );
};

export default QuestionBankManager;