import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Question } from '@/types/database';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuestionForm from './questions/QuestionForm';
import { Trash2 } from 'lucide-react';

interface EditQuestionsListProps {
  contestId: string;
}

const EditQuestionsList = ({ contestId }: EditQuestionsListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);

  console.log('Contest ID in EditQuestionsList:', contestId); // Debug log

  const { data: questions, isLoading } = useQuery({
    queryKey: ['questions', contestId],
    queryFn: async () => {
      if (!contestId) {
        console.error('No contest ID provided');
        return [];
      }

      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('contest_id', contestId)
        .order('order_number');

      if (error) {
        console.error('Error fetching questions:', error);
        throw error;
      }

      return data;
    },
    enabled: !!contestId,
  });

  const addQuestionMutation = useMutation({
    mutationFn: async (questionData: Omit<Question, 'id'>) => {
      if (!contestId) {
        throw new Error('Contest ID is required');
      }

      console.log('Adding question with contest_id:', contestId); // Debug log

      const { data, error } = await supabase
        .from('questions')
        .insert([{ 
          ...questionData, 
          contest_id: contestId,
          type: 'multiple_choice' as const
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding question:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
      toast({
        title: "Question ajoutée",
        description: "La question a été ajoutée avec succès",
      });
      setShowAddForm(false);
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la question",
        variant: "destructive",
      });
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: async (questionId: string) => {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
      toast({
        title: "Question supprimée",
        description: "La question a été supprimée avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la question",
        variant: "destructive",
      });
    },
  });

  const handleAddQuestion = (formData: Omit<Question, 'id'>) => {
    if (!contestId) {
      console.error('No contest ID provided for adding question');
      toast({
        title: "Erreur",
        description: "ID du concours manquant",
        variant: "destructive",
      });
      return;
    }

    addQuestionMutation.mutate({
      ...formData,
      contest_id: contestId,
      type: 'multiple_choice' as const
    });
  };

  if (isLoading) {
    return <div>Chargement des questions...</div>;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Questions du concours</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {questions && questions.length > 0 ? (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <Card key={question.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">
                        Question {index + 1}: {question.question_text}
                      </h3>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          Réponse correcte: {question.correct_answer}
                        </p>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Options:</p>
                          <ul className="list-disc list-inside">
                            {question.options.map((option, i) => (
                              <li key={i} className="text-sm text-gray-600">
                                {option}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {question.article_url && (
                          <p className="text-sm text-blue-600">
                            <a href={question.article_url} target="_blank" rel="noopener noreferrer">
                              Article lié
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteQuestionMutation.mutate(question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Aucune question n'a encore été ajoutée à ce concours.
            </p>
          )}

          {showAddForm ? (
            <div className="mt-4">
              <QuestionForm
                onSubmit={handleAddQuestion}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          ) : (
            <Button
              onClick={() => setShowAddForm(true)}
              className="w-full mt-4"
            >
              Ajouter une question
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EditQuestionsList;