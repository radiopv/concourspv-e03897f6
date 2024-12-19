import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const QuestionBank = () => {
  const { toast } = useToast();
  const { data: questions, isLoading } = useQuery({
    queryKey: ['question-bank'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('question_bank')
        .select('*');

      if (error) {
        console.error('Error fetching questions:', error);
        throw error;
      }
      return data;
    }
  });

  const handleDelete = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from('question_bank')
        .delete()
        .eq('id', questionId);

      if (error) throw error;

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

  if (isLoading) {
    return <div>Chargement des questions...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Banque de Questions</h1>
      <div className="space-y-4">
        {questions?.map((question) => (
          <div key={question.id} className="border p-4 rounded">
            <h2 className="font-semibold">{question.question_text}</h2>
            <Button onClick={() => handleDelete(question.id)} variant="destructive">
              Supprimer
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionBank;
