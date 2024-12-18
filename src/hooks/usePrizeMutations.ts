import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../App";
import { useToast } from "@/hooks/use-toast";

export const usePrizeMutations = (contestId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addPrizeToCatalog = useMutation({
    mutationFn: async (data: any) => {
      console.log("Adding prize to catalog:", data);
      const { error } = await supabase
        .from('prize_catalog')
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prize-catalog'] });
      toast({
        title: "Succès",
        description: "Le prix a été ajouté au catalogue",
      });
    },
    onError: (error) => {
      console.error("Add prize error:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le prix",
        variant: "destructive",
      });
    }
  });

  const updatePrize = useMutation({
    mutationFn: async ({ prizeId, data }: { prizeId: string, data: any }) => {
      console.log("Updating prize:", prizeId, data);
      const { error } = await supabase
        .from('prize_catalog')
        .update(data)
        .eq('id', prizeId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prize-catalog'] });
      if (contestId) {
        queryClient.invalidateQueries({ queryKey: ['prizes', contestId] });
      }
      toast({
        title: "Succès",
        description: "Le prix a été mis à jour",
      });
    },
    onError: (error) => {
      console.error("Update prize error:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le prix",
        variant: "destructive",
      });
    }
  });

  const deletePrize = useMutation({
    mutationFn: async (prizeId: string) => {
      console.log("Deleting prize:", prizeId);
      const { error } = await supabase
        .from('prize_catalog')
        .delete()
        .eq('id', prizeId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prize-catalog'] });
      toast({
        title: "Succès",
        description: "Le prix a été supprimé du catalogue",
      });
    },
    onError: (error) => {
      console.error("Delete prize error:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le prix",
        variant: "destructive",
      });
    }
  });

  return {
    addPrizeToCatalog,
    updatePrize,
    deletePrize
  };
};