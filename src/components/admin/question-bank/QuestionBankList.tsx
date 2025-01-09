import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  article_url?: string;
}

const QuestionBankList = () => {
  const { toast } = useToast();
  
  const { data: questions, isLoading, isError, error } = useQuery({
    queryKey: ['questions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('id, question_text, options, correct_answer, article_url')
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
          <CardContent>
            <h3 className="font-semibold">{question.question_text}</h3>
            <p>Options: {question.options.join(', ')}</p>
            <p>Réponse correcte: {question.correct_answer}</p>
            {question.article_url && (
              <p>
                <a href={question.article_url} target="_blank" rel="noopener noreferrer">
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
