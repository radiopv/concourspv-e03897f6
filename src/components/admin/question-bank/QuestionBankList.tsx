import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../App";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ExternalLink, Link, Pencil, Save, X, Archive } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  article_url?: string;
  status: 'available' | 'used' | 'archived';
  assigned_contest?: {
    id: string;
    title: string;
  };
}

const QuestionBankList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [selectedContestId, setSelectedContestId] = useState<string>("");
  const [editingUrl, setEditingUrl] = useState<string | null>(null);
  const [newUrl, setNewUrl] = useState<string>("");

  const { data: questions, refetch: refetchQuestions } = useQuery({
    queryKey: ['question-bank'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('question_bank')
        .select(`
          *,
          assigned_contest:contests(id, title)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Question[];
    }
  });

  const { data: contests } = useQuery({
    queryKey: ['active-contests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select('id, title')
        .in('status', ['draft', 'active'])
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleUrlEdit = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from('question_bank')
        .update({ article_url: newUrl })
        .eq('id', questionId);

      if (error) throw error;

      await refetchQuestions();
      
      toast({
        title: "Succès",
        description: "L'URL de l'article a été mise à jour",
      });

      setEditingUrl(null);
      setNewUrl("");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'URL",
        variant: "destructive",
      });
    }
  };

  const handleAssignToContest = async () => {
    if (!selectedContestId || selectedQuestions.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un concours et au moins une question",
        variant: "destructive",
      });
      return;
    }

    try {
      // Mettre à jour le statut des questions dans la banque
      const { error: updateError } = await supabase
        .from('question_bank')
        .update({ 
          status: 'used',
          contest_id: selectedContestId 
        })
        .in('id', selectedQuestions);

      if (updateError) throw updateError;

      // Récupérer les questions sélectionnées
      const selectedQuestionsData = questions?.filter(q => selectedQuestions.includes(q.id));

      if (!selectedQuestionsData) {
        throw new Error("Impossible de trouver les questions sélectionnées");
      }

      // Ajouter les questions au concours
      const { error: insertError } = await supabase
        .from('questions')
        .insert(selectedQuestionsData.map(q => ({
          contest_id: selectedContestId,
          question_text: q.question_text,
          options: q.options,
          correct_answer: q.correct_answer,
          article_url: q.article_url,
          type: 'multiple_choice'
        })));

      if (insertError) throw insertError;

      // Rafraîchir les données
      await refetchQuestions();
      await queryClient.invalidateQueries({ queryKey: ['questions', selectedContestId] });
      await queryClient.invalidateQueries({ queryKey: ['admin-contests'] });

      toast({
        title: "Succès",
        description: `${selectedQuestions.length} questions ajoutées au concours`,
      });

      setSelectedQuestions([]);
      setSelectedContestId("");
    } catch (error) {
      console.error('Error assigning questions:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout des questions au concours",
        variant: "destructive",
      });
    }
  };

  const handleArchive = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from('question_bank')
        .update({ status: 'archived' })
        .eq('id', questionId);

      if (error) throw error;

      await refetchQuestions();
      
      toast({
        title: "Succès",
        description: "La question a été archivée",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'archiver la question",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center mb-6">
        <Select value={selectedContestId} onValueChange={setSelectedContestId}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Sélectionner un concours" />
          </SelectTrigger>
          <SelectContent>
            {contests?.map((contest) => (
              <SelectItem key={contest.id} value={contest.id}>
                {contest.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          onClick={handleAssignToContest}
          disabled={!selectedContestId || selectedQuestions.length === 0}
        >
          Ajouter au concours ({selectedQuestions.length} sélectionnée{selectedQuestions.length > 1 ? 's' : ''})
        </Button>
      </div>

      {questions?.map((question) => (
        <Card key={question.id} className={`
          ${selectedQuestions.includes(question.id) ? 'border-primary' : ''}
          ${question.status === 'archived' ? 'opacity-50' : ''}
        `}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{question.question_text}</p>
                  {question.status === 'used' && question.assigned_contest && (
                    <Badge variant="secondary">
                      Utilisée dans: {question.assigned_contest.title}
                    </Badge>
                  )}
                  {question.status === 'archived' && (
                    <Badge variant="outline">Archivée</Badge>
                  )}
                </div>
                <ul className="mt-2 space-y-1">
                  {question.options.map((option, index) => (
                    <li key={index} className={option === question.correct_answer ? "text-green-600" : ""}>
                      {option}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2">
                  <Link className="h-4 w-4 text-gray-500" />
                  {editingUrl === question.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        placeholder="https://..."
                        className="flex-1"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleUrlEdit(question.id)}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditingUrl(null);
                          setNewUrl("");
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 flex-1">
                      {question.article_url ? (
                        <a
                          href={question.article_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          {question.article_url}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-gray-500 italic">Aucun article lié</span>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditingUrl(question.id);
                          setNewUrl(question.article_url || "");
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {question.status === 'available' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (selectedQuestions.includes(question.id)) {
                        setSelectedQuestions(prev => prev.filter(id => id !== question.id));
                      } else {
                        setSelectedQuestions(prev => [...prev, question.id]);
                      }
                    }}
                  >
                    {selectedQuestions.includes(question.id) ? 'Désélectionner' : 'Sélectionner'}
                  </Button>
                )}
                {question.status !== 'archived' && (
                  <Button
                    variant="outline"
                    onClick={() => handleArchive(question.id)}
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    Archiver
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuestionBankList;
