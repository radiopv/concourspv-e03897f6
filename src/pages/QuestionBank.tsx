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
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .is('contest_id', null)
        .eq('status', 'available');

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Question Bank</CardTitle>
        </CardHeader>
        <CardContent>
          <AddQuestionForm />
          <div className="mt-4">
            <Button variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </div>
        </CardContent>
      </Card>
      <QuestionBankList />
    </div>
  );
};

export default QuestionBank;