import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const ContestQuestionsManager = () => {
  const { contestId } = useParams();
  const { toast } = useToast();

  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ['question-bank'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('question_bank')
        .select('*')
        .eq('status', 'available');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: contestQuestions, isLoading: contestQuestionsLoading, refetch } = useQuery({
    queryKey: ['contest-questions', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('contest_id', contestId);
      
      if (error) throw error;
      return data;
    }
  });

  const handleAddQuestion = async (questionBankId: string) => {
    try {
      const questionToAdd = questions?.find(q => q.id === questionBankId);
      
      if (!questionToAdd) return;

      const { error } = await supabase
        .from('questions')
        .insert([{
          contest_id: contestId,
          question_text: questionToAdd.question_text,
          options: questionToAdd.options,
          correct_answer: questionToAdd.correct_answer,
          article_url: questionToAdd.article_url,
          type: 'multiple_choice'
        }]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Question ajoutée au concours",
      });

      refetch();
    } catch (error) {
      console.error('Error adding question:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la question",
        variant: "destructive",
      });
    }
  };

  const handleRemoveQuestion = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Question retirée du concours",
      });

      refetch();
    } catch (error) {
      console.error('Error removing question:', error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer la question",
        variant: "destructive",
      });
    }
  };

  if (questionsLoading || contestQuestionsLoading) {
    return <div>Chargement...</div>;
  }

  const isQuestionInContest = (questionBankId: string) => {
    return contestQuestions?.some(q => 
      q.question_text === questions?.find(bq => bq.id === questionBankId)?.question_text
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Gestion des Questions du Concours</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Questions disponibles */}
        <Card>
          <CardHeader>
            <CardTitle>Questions Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {questions?.map((question) => (
                  <Card key={question.id} className="p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium mb-2">{question.question_text}</h3>
                        <div className="space-y-1 text-sm text-gray-500">
                          {Array.isArray(question.options) && question.options.map((option: string, index: number) => (
                            <p key={index} className={option === question.correct_answer ? "text-green-600 font-medium" : ""}>
                              {option}
                            </p>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant={isQuestionInContest(question.id) ? "secondary" : "default"}
                        size="sm"
                        onClick={() => handleAddQuestion(question.id)}
                        disabled={isQuestionInContest(question.id)}
                      >
                        {isQuestionInContest(question.id) ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Questions du concours */}
        <Card>
          <CardHeader>
            <CardTitle>Questions du Concours</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {contestQuestions?.map((question) => (
                  <Card key={question.id} className="p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium mb-2">{question.question_text}</h3>
                        <div className="space-y-1 text-sm text-gray-500">
                          {Array.isArray(question.options) && question.options.map((option: string, index: number) => (
                            <p key={index} className={option === question.correct_answer ? "text-green-600 font-medium" : ""}>
                              {option}
                            </p>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveQuestion(question.id)}
                      >
                        Retirer
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContestQuestionsManager;