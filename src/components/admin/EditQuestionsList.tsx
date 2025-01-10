import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Plus, Loader, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuestionBankSelector from './question-bank/QuestionBankSelector';
import QuestionForm from './questions/QuestionForm';
import QuestionList from './questions/QuestionList';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const EditQuestionsList = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedQuestions, setSelectedQuestions] = React.useState<string[]>([]);

  const { data: questions, refetch, isLoading } = useQuery({
    queryKey: ['questions', contestId],
    queryFn: async () => {
      if (!contestId) throw new Error('Contest ID is required');
      
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('contest_id', contestId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!contestId
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

  if (!contestId) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Erreur</h2>
        <p className="mb-4">ID du concours manquant</p>
        <Button onClick={() => navigate('/admin/contests')}>
          Retour aux concours
        </Button>
      </div>
    );
  }

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
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/contests')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux concours
        </Button>
        <h1 className="text-2xl font-bold">Questions du concours</h1>
      </div>

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
                contestId={contestId}
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