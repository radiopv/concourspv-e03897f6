import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ContestCard from './ContestCard';
import EditContestForm from './EditContestForm';
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../../App";

interface ContestListProps {
  contests: Array<{
    id: string;
    title: string;
    description?: string;
    status: string;
    start_date: string;
    end_date: string;
    is_featured: boolean;
    is_new: boolean;
    has_big_prizes: boolean;
    participants?: { count: number };
    questions?: { count: number };
  }>;
  onSelectContest: (id: string) => void;
}

const ContestList = ({ contests, onSelectContest }: ContestListProps) => {
  const [editingContestId, setEditingContestId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contestsWithCounts } = useQuery({
    queryKey: ['admin-contests-with-counts'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        throw new Error("Not authenticated");
      }

      // Récupérer les concours avec le nombre de participants et de questions
      const { data: contests, error: contestsError } = await supabase
        .from('contests')
        .select(`
          *,
          participants:participants(count),
          questions:questions(count)
        `)
        .order('created_at', { ascending: false });
      
      if (contestsError) throw contestsError;

      // Pour chaque concours, récupérer le nombre exact de questions
      const contestsWithQuestionCounts = await Promise.all(contests.map(async (contest) => {
        const { count: questionsCount, error: questionsError } = await supabase
          .from('questions')
          .select('*', { count: 'exact', head: true })
          .eq('contest_id', contest.id);

        if (questionsError) throw questionsError;

        return {
          ...contest,
          questions: { count: questionsCount }
        };
      }));

      return contestsWithQuestionCounts;
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 5000 // Rafraîchir toutes les 5 secondes
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contests')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests-with-counts'] });
      toast({
        title: "Succès",
        description: "Le concours a été supprimé",
      });
    },
    onError: (error) => {
      console.error('Error deleting contest:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le concours",
        variant: "destructive",
      });
    }
  });

  const archiveMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contests')
        .update({ status: 'archived' })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests-with-counts'] });
      toast({
        title: "Succès",
        description: "Le concours a été archivé",
      });
    },
    onError: (error) => {
      console.error('Error archiving contest:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'archiver le concours",
        variant: "destructive",
      });
    }
  });

  const featureToggleMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      const { error } = await supabase
        .from('contests')
        .update({ is_featured: featured })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests-with-counts'] });
      toast({
        title: "Succès",
        description: "Le statut en vedette a été mis à jour",
      });
    },
    onError: (error) => {
      console.error('Error updating contest feature status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut en vedette",
        variant: "destructive",
      });
    }
  });

  const statusUpdateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: { is_new?: boolean; has_big_prizes?: boolean } }) => {
      const { error } = await supabase
        .from('contests')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests-with-counts'] });
      toast({
        title: "Succès",
        description: "Le statut du concours a été mis à jour",
      });
    },
    onError: (error) => {
      console.error('Error updating contest status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {(contestsWithCounts || contests).map((contest) => (
        <ContestCard
          key={contest.id}
          contest={contest}
          onDelete={(id) => deleteMutation.mutate(id)}
          onArchive={(id) => archiveMutation.mutate(id)}
          onFeatureToggle={(id, featured) => featureToggleMutation.mutate({ id, featured })}
          onStatusUpdate={(id, updates) => statusUpdateMutation.mutate({ id, updates })}
          onSelect={onSelectContest}
          onEdit={() => setEditingContestId(contest.id)}
        />
      ))}

      {editingContestId && (
        <Dialog open={true} onOpenChange={() => setEditingContestId(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <EditContestForm
              contestId={editingContestId}
              onClose={() => {
                setEditingContestId(null);
                queryClient.invalidateQueries({ queryKey: ['contests'] });
                queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
                queryClient.invalidateQueries({ queryKey: ['admin-contests-with-counts'] });
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ContestList;