import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Plus, Check } from "lucide-react";

interface QuestionBankSelectorProps {
  contestId: string;
  onQuestionSelect: (questionId: string) => void;
  selectedQuestions: string[];
}

const QuestionBankSelector = ({ contestId, onQuestionSelect, selectedQuestions }: QuestionBankSelectorProps) => {
  const { toast } = useToast();
  
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

  const handleQuestionSelect = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from('questions')
        .insert([{
          contest_id: contestId,
          question_bank_id: questionId,
          status: 'active'
        }]);

      if (error) throw error;

      onQuestionSelect(questionId);
      toast({
        title: "Succès",
        description: "Question ajoutée au concours",
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

  if (isLoading) {
    return <div>Chargement de la banque de questions...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {questions?.map((question) => (
        <Card 
          key={question.id}
          className={`relative transition-all duration-200 ${
            selectedQuestions.includes(question.id) 
              ? 'border-green-500 bg-green-50' 
              : 'hover:border-blue-200'
          }`}
        >
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">{question.question_text}</h3>
            <div className="space-y-1">
              {question.options.map((option: string, index: number) => (
                <p 
                  key={index}
                  className={option === question.correct_answer ? "text-green-600" : ""}
                >
                  {option}
                </p>
              ))}
            </div>
            {question.article_url && (
              <a 
                href={question.article_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline mt-2 block"
              >
                Lien vers l'article
              </a>
            )}
            <Button
              onClick={() => handleQuestionSelect(question.id)}
              className="mt-4 w-full"
              disabled={selectedQuestions.includes(question.id)}
            >
              {selectedQuestions.includes(question.id) ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Ajoutée
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter au concours
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuestionBankSelector;