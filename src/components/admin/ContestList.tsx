import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ContestCard from './ContestCard';
import EditContestForm from './EditContestForm';
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
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

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contests')
        .delete()
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['contests'] });
      toast({
        title: "Succès",
        description: "Le concours a été supprimé",
      });
    } catch (error) {
      console.error('Error deleting contest:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le concours",
        variant: "destructive",
      });
    }
  };

  const handleArchive = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contests')
        .update({ status: 'archived' })
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['contests'] });
      toast({
        title: "Succès",
        description: "Le concours a été archivé",
      });
    } catch (error) {
      console.error('Error archiving contest:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'archiver le concours",
        variant: "destructive",
      });
    }
  };

  const handleFeatureToggle = async (id: string, featured: boolean) => {
    try {
      const { error } = await supabase
        .from('contests')
        .update({ is_featured: featured })
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['contests'] });
      toast({
        title: "Succès",
        description: featured ? "Le concours est maintenant en vedette" : "Le concours n'est plus en vedette",
      });
    } catch (error) {
      console.error('Error updating contest feature status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut en vedette",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (id: string, updates: { is_new?: boolean; has_big_prizes?: boolean }) => {
    try {
      const { error } = await supabase
        .from('contests')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['contests'] });
      toast({
        title: "Succès",
        description: "Le statut du concours a été mis à jour",
      });
    } catch (error) {
      console.error('Error updating contest status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contests.map((contest) => (
        <ContestCard
          key={contest.id}
          contest={contest}
          onDelete={handleDelete}
          onArchive={handleArchive}
          onFeatureToggle={handleFeatureToggle}
          onStatusUpdate={handleStatusUpdate}
          onSelect={onSelectContest}
          onEdit={() => setEditingContestId(contest.id)}
        />
      ))}

      {editingContestId && (
        <Dialog open={true} onOpenChange={() => setEditingContestId(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <EditContestForm
              contestId={editingContestId}
              onClose={() => setEditingContestId(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ContestList;