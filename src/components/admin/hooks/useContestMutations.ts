import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "../../../App";

export const useContestMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
    queryClient.invalidateQueries({ queryKey: ['admin-contests-with-counts'] });
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting contest:', id);
      
      // First delete related records
      const { error: questionsError } = await supabase
        .from('questions')
        .delete()
        .eq('contest_id', id);

      if (questionsError) {
        console.error('Error deleting questions:', questionsError);
        throw questionsError;
      }

      const { error: prizesError } = await supabase
        .from('prizes')
        .delete()
        .eq('contest_id', id);

      if (prizesError) {
        console.error('Error deleting prizes:', prizesError);
        throw prizesError;
      }

      // Finally delete the contest
      const { error } = await supabase
        .from('contests')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting contest:', error);
        throw error;
      }
    },
    onSuccess: () => {
      invalidateQueries();
      toast({
        title: "Succès",
        description: "Le concours a été supprimé",
      });
    },
    onError: (error) => {
      console.error('Error in delete mutation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le concours",
        variant: "destructive",
      });
    }
  });

  const archiveMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Archiving contest:', id);
      const { error } = await supabase
        .from('contests')
        .update({ status: 'archived' })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateQueries();
      toast({
        title: "Succès",
        description: "Le concours a été archivé",
      });
    },
    onError: (error) => {
      console.error('Error in archive mutation:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'archiver le concours",
        variant: "destructive",
      });
    }
  });

  const featureToggleMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      console.log('Updating feature status:', { id, featured });
      const { error } = await supabase
        .from('contests')
        .update({ is_featured: featured })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateQueries();
      toast({
        title: "Succès",
        description: "Le statut en vedette a été mis à jour",
      });
    },
    onError: (error) => {
      console.error('Error in feature toggle mutation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut en vedette",
        variant: "destructive",
      });
    }
  });

  const statusUpdateMutation = useMutation({
    mutationFn: async ({ id, updates }: { 
      id: string; 
      updates: { 
        is_new?: boolean; 
        has_big_prizes?: boolean;
        status?: 'draft' | 'active' | 'archived';
      } 
    }) => {
      console.log('Updating contest status:', { id, updates });
      const { error } = await supabase
        .from('contests')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateQueries();
      toast({
        title: "Succès",
        description: "Le statut du concours a été mis à jour",
      });
    },
    onError: (error) => {
      console.error('Error in status update mutation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  });

  return {
    deleteMutation,
    archiveMutation,
    featureToggleMutation,
    statusUpdateMutation
  };
};