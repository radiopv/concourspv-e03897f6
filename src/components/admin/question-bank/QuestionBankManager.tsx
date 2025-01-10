import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import QuestionBankList from "./QuestionBankList";
import AddQuestionForm from "./AddQuestionForm";
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
      <Card>
        <CardHeader>
          <CardTitle>Banque de Questions</CardTitle>
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

export default QuestionBankManager;