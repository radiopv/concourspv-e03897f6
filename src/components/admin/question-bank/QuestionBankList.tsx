import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Question } from '@/types/database';

const QuestionBankList = () => {
  const { toast } = useToast();
  
  const { data: questions, isLoading, isError, error } = useQuery({
    queryKey: ['questions-bank'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('id, question_text, options, correct_answer, article_url')
        .is('contest_id', null)
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Question[];
    }
  });

  if (isLoading) {
    return <div>Chargement des questions...</div>;
  }

  if (isError && error instanceof Error) {
    toast({
      title: "Erreur",
      description: "Impossible de charger les questions: " + error.message,
      variant: "destructive",
    });
    return null;
  }

  return (
    <div className="space-y-4">
      {questions?.map((question) => (
        <Card key={question.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <h3 className="font-semibold">{question.question_text}</h3>
            {Array.isArray(question.options) && (
              <div className="mt-2 space-y-1">
                {question.options.map((option: string, index: number) => (
                  <p 
                    key={index}
                    className={option === question.correct_answer ? "text-green-600" : ""}
                  >
                    {option}
                  </p>
                ))}
              </div>
            )}
            {question.article_url && (
              <p className="mt-2">
                <a 
                  href={question.article_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Lien vers l'article
                </a>
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuestionBankList;