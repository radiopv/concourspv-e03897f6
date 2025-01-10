import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Plus, Loader } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuestionBankSelector from './question-bank/QuestionBankSelector';
import QuestionForm from './questions/QuestionForm';
import QuestionList from './questions/QuestionList';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface EditQuestionsListProps {
  contestId: string | null;
}

const EditQuestionsList = ({ contestId }: EditQuestionsListProps) => {
  const { toast } = useToast();
  const [selectedQuestions, setSelectedQuestions] = React.useState<string[]>([]);

  const { data: questions, refetch, isLoading } = useQuery({
    queryKey: ['questions', contestId],
    queryFn: async () => {
      let query = supabase.from('questions').select('*');
      
      if (contestId) {
        query = query.eq('contest_id', contestId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleAddQuestion = async (formData: any) => {
    try {
      const { error } = await supabase
        .from('questions')
        .insert([{
          contest_id: contestId,
          question_text: formData.question_text,
          options: formData.options.filter((opt: string) => opt !== ""),
          correct_answer: formData.correct_answer,
          article_url: formData.article_url || null,
          image_url: formData.image_url || null,
          type: 'multiple_choice'
        }]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Question ajoutée avec succès",
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

  const handleUpdateQuestion = async (questionId: string, updatedData: any) => {
    try {
      const { error } = await supabase
        .from('questions')
        .update(updatedData)
        .eq('id', questionId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Question mise à jour avec succès",
      });

      refetch();
    } catch (error) {
      console.error('Error updating question:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la question",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

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
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="w-8 h-8 animate-spin" />
        <span className="ml-2">Chargement des questions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <Tabs defaultValue="bank" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bank">Banque de questions</TabsTrigger>
          <TabsTrigger value="manual">Ajout manuel</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bank" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sélectionner des questions</CardTitle>
            </CardHeader>
            <CardContent>
              <QuestionBankSelector
                contestId={contestId || ''}
                onQuestionSelect={(questionId) => {
                  setSelectedQuestions([...selectedQuestions, questionId]);
                  refetch();
                }}
                selectedQuestions={selectedQuestions}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Ajouter une question manuellement</CardTitle>
            </CardHeader>
            <CardContent>
              <QuestionForm onSubmit={handleAddQuestion} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {questions && questions.length > 0 && (
        <QuestionList
          questions={questions}
          onEdit={handleUpdateQuestion}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default EditQuestionsList;