import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Save, Trash2, X, ExternalLink, Plus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Question } from '@/types/database';

const QuestionTableView = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedQuestion, setEditedQuestion] = useState<Partial<Question>>({});

  const { data: questions, isLoading } = useQuery({
    queryKey: ['questions-bank'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .is('contest_id', null) // Only get questions not associated with a contest
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: contests } = useQuery({
    queryKey: ['contests-with-questions-count'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select(`
          id,
          title,
          questions:questions(count)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      return data.map((contest: any) => ({
        id: contest.id,
        title: contest.title,
        questions: { count: contest.questions[0]?.count || 0 }
      }));
    }
  });

  const addToContestMutation = useMutation({
    mutationFn: async ({ questionId, contestId }: { questionId: string, contestId: string }) => {
      // Get the question from the questions table
      const { data: questionData, error: fetchError } = await supabase
        .from('questions')
        .select('*')
        .eq('id', questionId)
        .single();

      if (fetchError) throw fetchError;

      // Check if a question with the same URL exists in the contest
      if (questionData.article_url) {
        const { data: existingQuestions, error: checkError } = await supabase
          .from('questions')
          .select('id, article_url')
          .eq('contest_id', contestId)
          .not('article_url', 'is', null);

        if (checkError) throw checkError;

        const duplicateArticle = existingQuestions?.some(
          q => q.article_url === questionData.article_url
        );

        if (duplicateArticle) {
          throw new Error('Une question avec le même URL d\'article existe déjà dans ce concours');
        }
      }

      // Update the question to associate it with the contest
      const { error: updateError } = await supabase
        .from('questions')
        .update({ contest_id: contestId })
        .eq('id', questionId);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contests-with-questions-count'] });
      queryClient.invalidateQueries({ queryKey: ['questions-bank'] });
      toast({
        title: "Question ajoutée",
        description: "La question a été ajoutée au concours avec succès",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter la question au concours",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (question: Partial<Question> & { id: string }) => {
      const { error } = await supabase
        .from('questions')
        .update({
          question_text: question.question_text,
          options: question.options,
          correct_answer: question.correct_answer,
          article_url: question.article_url,
        })
        .eq('id', question.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions-bank'] });
      toast({
        title: "Question mise à jour",
        description: "La question a été modifiée avec succès",
      });
      setEditingId(null);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la question",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions-bank'] });
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
    }
  });

  const handleEdit = (question: Question) => {
    setEditingId(question.id);
    setEditedQuestion(question);
  };

  const handleSave = async (id: string) => {
    if (!editedQuestion) return;
    
    await updateMutation.mutate({
      id,
      ...editedQuestion
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedQuestion({});
  };

  if (isLoading) {
    return <div>Chargement des questions...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Question</TableHead>
            <TableHead className="w-[200px]">Réponse correcte</TableHead>
            <TableHead className="w-[300px]">Options</TableHead>
            <TableHead className="w-[200px]">URL Article</TableHead>
            <TableHead className="w-[250px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions?.map((question: Question) => (
            <TableRow key={question.id}>
              <TableCell>
                {editingId === question.id ? (
                  <Input
                    value={editedQuestion.question_text || question.question_text}
                    onChange={(e) => setEditedQuestion({
                      ...editedQuestion,
                      question_text: e.target.value
                    })}
                  />
                ) : (
                  question.question_text
                )}
              </TableCell>
              <TableCell>
                {editingId === question.id ? (
                  <Input
                    value={editedQuestion.correct_answer || question.correct_answer}
                    onChange={(e) => setEditedQuestion({
                      ...editedQuestion,
                      correct_answer: e.target.value
                    })}
                  />
                ) : (
                  <span className="text-green-600 font-medium">
                    {question.correct_answer}
                  </span>
                )}
              </TableCell>
              <TableCell>
                {editingId === question.id ? (
                  <div className="space-y-2">
                    {(editedQuestion.options || question.options)?.map((option: string, index: number) => (
                      <Input
                        key={index}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(editedQuestion.options || question.options)];
                          newOptions[index] = e.target.value;
                          setEditedQuestion({
                            ...editedQuestion,
                            options: newOptions
                          });
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <ul className="list-disc list-inside">
                    {question.options?.map((option: string, index: number) => (
                      <li key={index} className={option === question.correct_answer ? "text-green-600" : ""}>
                        {option}
                      </li>
                    ))}
                  </ul>
                )}
              </TableCell>
              <TableCell>
                {editingId === question.id ? (
                  <Input
                    value={editedQuestion.article_url || question.article_url}
                    onChange={(e) => setEditedQuestion({
                      ...editedQuestion,
                      article_url: e.target.value
                    })}
                  />
                ) : (
                  question.article_url && (
                    <a
                      href={question.article_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Voir l'article
                    </a>
                  )
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {editingId === question.id ? (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSave(question.id)}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCancel}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Select
                        onValueChange={(contestId) => {
                          addToContestMutation.mutate({ 
                            questionId: question.id, 
                            contestId 
                          });
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Ajouter au concours" />
                        </SelectTrigger>
                        <SelectContent>
                          {contests?.map((contest) => (
                            <SelectItem key={contest.id} value={contest.id}>
                              {contest.title} ({contest.questions.count} questions)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(question)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer cette question ? Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(question.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default QuestionTableView;
