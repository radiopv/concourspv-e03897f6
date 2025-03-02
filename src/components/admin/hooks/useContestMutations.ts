
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { localData } from "@/lib/localData";
import { ContestStatus, ContestStatusUpdate } from "@/types/contest";

export const useContestMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['contests'] });
    queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
    queryClient.invalidateQueries({ queryKey: ['admin-contests-with-counts'] });
  };

  const resetContestMutation = useMutation({
    mutationFn: async (contestId: string) => {
      console.log('Resetting contest:', contestId);
      // Get all participants for this contest
      const contestParticipants = await localData.participants.getByContestId(contestId);
      
      // Delete each participant
      for (const participant of contestParticipants) {
        await localData.participants.delete(participant.id);
      }
    },
    onSuccess: () => {
      invalidateQueries();
      toast({
        title: "Concours réinitialisé",
        description: "Toutes les participations ont été supprimées",
      });
    },
    onError: (error) => {
      console.error('Error resetting contest:', error);
      toast({
        title: "Erreur",
        description: "Impossible de réinitialiser le concours",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await localData.contests.delete(id);
    },
    onSuccess: () => {
      invalidateQueries();
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
      await localData.contests.archive(id);
    },
    onSuccess: () => {
      invalidateQueries();
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
      await localData.contests.update(id, { is_featured: featured });
    },
    onSuccess: () => {
      invalidateQueries();
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
    mutationFn: async ({ id, updates }: { 
      id: string; 
      updates: ContestStatusUpdate;
    }) => {
      await localData.contests.update(id, updates);
    },
    onSuccess: () => {
      invalidateQueries();
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

  return {
    deleteMutation,
    archiveMutation,
    featureToggleMutation,
    statusUpdateMutation,
    resetContestMutation
  };
};
