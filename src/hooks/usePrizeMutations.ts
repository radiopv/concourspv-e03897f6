import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const usePrizeMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addPrizeToCatalog = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from('prize_catalog').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prize-catalog'] });
      toast({
        title: "Succès",
        description: "Le prix a été ajouté au catalogue.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updatePrize = useMutation({
    mutationFn: async ({ prizeId, data }: { prizeId: string; data: any }) => {
      const { error } = await supabase.from('prize_catalog').update(data).eq('id', prizeId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prize-catalog'] });
      toast({
        title: "Succès",
        description: "Le prix a été mis à jour.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deletePrize = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('prize_catalog').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prize-catalog'] });
      toast({
        title: "Succès",
        description: "Le prix a été supprimé.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return { addPrizeToCatalog, updatePrize, deletePrize };
};