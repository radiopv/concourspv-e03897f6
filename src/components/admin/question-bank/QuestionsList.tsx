import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const QuestionsList = () => {
  const { toast } = useToast();
  const { data: questions, isLoading, refetch } = useQuery({
    queryKey: ['questions-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('question_bank')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('question_bank')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Question supprimée avec succès",
      });

      refetch();
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la question",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Banque de Questions ({questions?.length || 0})</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {questions?.map((question) => (
              <Card key={question.id} className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{question.question_text}</h3>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(question.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {Array.isArray(question.options) && question.options.map((option: string, index: number) => (
                      <div 
                        key={index}
                        className={`p-2 rounded ${
                          option === question.correct_answer 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-50"
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>

                  {question.article_url && (
                    <a
                      href={question.article_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Article source
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default QuestionsList;