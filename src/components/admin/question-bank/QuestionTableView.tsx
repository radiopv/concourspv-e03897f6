import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Question } from '@/types/database';
import QuestionStats from './components/QuestionStats';
import QuestionFilter from './components/QuestionFilter';
import QuestionRow from './components/QuestionRow';

const QuestionTableView = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedQuestion, setEditedQuestion] = useState<Partial<Question>>({});
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: contestsData } = useQuery({
    queryKey: ['contests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: questions, isLoading } = useQuery({
    queryKey: ['questions-bank'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .is('contest_id', null)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Question[];
    }
  });

  const filteredQuestions = questions?.filter(q => 
    statusFilter === 'all' ? true : q.status === statusFilter
  );

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

  const addToContestMutation = useMutation({
    mutationFn: async ({ questionId, contestId }: { questionId: string, contestId: string }) => {
      const { error } = await supabase
        .from('questions')
        .update({ 
          contest_id: contestId,
          status: 'in_use'
        })
        .eq('id', questionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions-bank'] });
      toast({
        title: "Question ajoutée",
        description: "La question a été ajoutée au concours avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la question au concours",
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
    return <div>Loading questions...</div>;
  }

  return (
    <div className="space-y-6">
      <QuestionStats questions={questions} />
      <QuestionFilter value={statusFilter} onChange={setStatusFilter} />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Question</TableHead>
              <TableHead className="w-[100px]">Statut</TableHead>
              <TableHead className="w-[200px]">Réponse correcte</TableHead>
              <TableHead className="w-[300px]">Options</TableHead>
              <TableHead className="w-[200px]">URL Article</TableHead>
              <TableHead className="w-[250px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions?.map((question) => (
              <QuestionRow
                key={question.id}
                question={question}
                editingId={editingId}
                editedQuestion={editedQuestion}
                contests={contestsData || []}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                onDelete={(id) => deleteMutation.mutate(id)}
                onAddToContest={(questionId, contestId) => 
                  addToContestMutation.mutate({ questionId, contestId })}
                setEditedQuestion={setEditedQuestion}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default QuestionTableView;