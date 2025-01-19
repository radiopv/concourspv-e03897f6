import React from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
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

const QuestionsList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: questions, isLoading, error } = useQuery({
    queryKey: ['questions-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('question_bank')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching questions:', error);
        throw error;
      }
      return data;
    }
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('question_bank')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting question:', error);
        throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ['questions-list'] });
      
      toast({
        title: "Succès",
        description: "Question supprimée avec succès",
      });
    } catch (error) {
      console.error('Error in handleDelete:', error);
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

  if (error) {
    return <div>Erreur lors du chargement des questions</div>;
  }

  return (
    <ScrollArea className="h-[600px] rounded-md border p-4">
      <div className="space-y-4">
        {questions?.map((question) => (
          <Card key={question.id}>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{question.question_text}</h3>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="ml-2"
                      >
                        <Trash className="h-4 w-4" />
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
                          onClick={() => handleDelete(question.id)}
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Options :</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {question.options.map((option: string, index: number) => (
                      <li key={index} className="text-sm">
                        {option}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm">
                    <span className="font-medium">Réponse correcte :</span>{" "}
                    {question.correct_answer}
                  </p>
                  {question.article_url && (
                    <a
                      href={question.article_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
                    >
                      Voir l'article source <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default QuestionsList;