import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../App";
import { Plus, Save, Trash2, ExternalLink } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  article_url?: string;
  status: string;
}

const QuestionBank = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const { data: questions, isLoading } = useQuery({
    queryKey: ['question-bank'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('question_bank')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Question[];
    }
  });

  const handleSave = async (question: Question) => {
    try {
      const { error } = await supabase
        .from('question_bank')
        .update({
          question_text: question.question_text,
          options: question.options,
          correct_answer: question.correct_answer,
          article_url: question.article_url,
          status: question.status
        })
        .eq('id', question.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['question-bank'] });
      toast({
        title: "Succès",
        description: "Question mise à jour",
      });
      setEditingQuestion(null);
    } catch (error) {
      console.error('Error updating question:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la question",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('question_bank')
        .delete()
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['question-bank'] });
      toast({
        title: "Succès",
        description: "Question supprimée",
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

  const handleAdd = async () => {
    try {
      const newQuestion = {
        question_text: "Nouvelle question",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correct_answer: "Option 1",
        status: "available"
      };

      const { error } = await supabase
        .from('question_bank')
        .insert([newQuestion]);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['question-bank'] });
      toast({
        title: "Succès",
        description: "Question ajoutée",
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
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Banque de questions</CardTitle>
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Ajouter une question
          </Button>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="space-y-4">
            {questions?.map((question) => (
              <AccordionItem key={question.id} value={question.id} className="border rounded-lg">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center gap-4 text-left">
                    <span className="font-medium">{question.question_text}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Question</Label>
                      <Input
                        value={editingQuestion?.id === question.id 
                          ? editingQuestion.question_text 
                          : question.question_text}
                        onChange={(e) => setEditingQuestion({
                          ...question,
                          question_text: e.target.value
                        })}
                      />
                    </div>

                    <div>
                      <Label>URL de l'article</Label>
                      <div className="flex gap-2">
                        <Input
                          value={editingQuestion?.id === question.id 
                            ? editingQuestion.article_url 
                            : question.article_url}
                          onChange={(e) => setEditingQuestion({
                            ...question,
                            article_url: e.target.value
                          })}
                          placeholder="https://..."
                        />
                        {question.article_url && (
                          <a 
                            href={question.article_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center px-2 py-1 text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Options de réponse</Label>
                      {(editingQuestion?.id === question.id 
                        ? editingQuestion.options 
                        : question.options)?.map((option, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...(editingQuestion?.options || question.options)];
                              newOptions[index] = e.target.value;
                              setEditingQuestion({
                                ...question,
                                options: newOptions
                              });
                            }}
                          />
                          <Button
                            variant={option === (editingQuestion?.id === question.id 
                              ? editingQuestion.correct_answer 
                              : question.correct_answer) ? "default" : "outline"}
                            onClick={() => setEditingQuestion({
                              ...question,
                              correct_answer: option
                            })}
                            className="min-w-[120px]"
                          >
                            {option === (editingQuestion?.id === question.id 
                              ? editingQuestion.correct_answer 
                              : question.correct_answer) ? "Correcte ✓" : "Marquer correcte"}
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button 
                        variant="destructive" 
                        onClick={() => handleDelete(question.id)}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Supprimer
                      </Button>
                      {editingQuestion?.id === question.id && (
                        <Button 
                          onClick={() => handleSave(editingQuestion)}
                          className="flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" /> Enregistrer
                        </Button>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionBank;