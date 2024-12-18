import React from 'react';
import ContestCard from './ContestCard';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../App";
import { useQueryClient } from "@tanstack/react-query";

interface Contest {
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
}

interface ContestListProps {
  contests: Contest[];
  onSelectContest: (id: string) => void;
}

const ContestList = ({ contests, onSelectContest }: ContestListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async (contestId: string) => {
    try {
      const { error } = await supabase
        .from('contests')
        .delete()
        .eq('id', contestId);
      
      if (error) throw error;

      // Invalider toutes les requêtes liées aux concours
      queryClient.invalidateQueries({ queryKey: ['contests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      
      toast({
        title: "Succès",
        description: "Le concours a été supprimé",
      });
    } catch (error) {
      console.error('Error deleting contest:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du concours",
        variant: "destructive",
      });
    }
  };

  const handleArchive = async (contestId: string) => {
    try {
      const { error } = await supabase
        .from('contests')
        .update({ status: 'archived' })
        .eq('id', contestId);
      
      if (error) throw error;

      // Invalider toutes les requêtes liées aux concours
      queryClient.invalidateQueries({ queryKey: ['contests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      
      toast({
        title: "Succès",
        description: "Le concours a été archivé",
      });
    } catch (error) {
      console.error('Error archiving contest:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'archivage du concours",
        variant: "destructive",
      });
    }
  };

  const handleFeatureToggle = async (contestId: string, featured: boolean) => {
    try {
      const { error } = await supabase
        .from('contests')
        .update({ is_featured: featured })
        .eq('id', contestId);
      
      if (error) throw error;

      // Invalider toutes les requêtes liées aux concours
      queryClient.invalidateQueries({ queryKey: ['contests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      
      toast({
        title: "Succès",
        description: featured ? "Le concours sera affiché sur la page d'accueil" : "Le concours ne sera plus affiché sur la page d'accueil",
      });
    } catch (error) {
      console.error('Error updating contest featured status:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du statut du concours",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (contestId: string, updates: { is_new?: boolean; has_big_prizes?: boolean }) => {
    try {
      const { error } = await supabase
        .from('contests')
        .update(updates)
        .eq('id', contestId);
      
      if (error) throw error;

      // Invalider toutes les requêtes liées aux concours
      queryClient.invalidateQueries({ queryKey: ['contests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      
      toast({
        title: "Succès",
        description: "Le statut du concours a été mis à jour",
      });
    } catch (error) {
      console.error('Error updating contest status:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du statut du concours",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
      {contests?.map((contest) => (
        <ContestCard
          key={contest.id}
          contest={contest}
          onDelete={handleDelete}
          onArchive={handleArchive}
          onFeatureToggle={handleFeatureToggle}
          onStatusUpdate={handleStatusUpdate}
          onSelect={onSelectContest}
        />
      ))}
    </div>
  );
};

export default ContestList;