import React from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import PrizeCatalogSelector from './prize/PrizeCatalogSelector';
import PrizeDisplay from './prize/PrizeDisplay';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../App";

interface ContestCardPrizeProps {
  contestId: string;
}

const ContestCardPrize = ({ contestId }: ContestCardPrizeProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Requête pour obtenir tous les prix associés au concours
  const { data: contestPrizes, isLoading } = useQuery({
    queryKey: ['contest-prizes', contestId],
    queryFn: async () => {
      console.log('Fetching prizes for contest:', contestId);
      const { data, error } = await supabase
        .from('prizes')
        .select(`
          *,
          catalog_item:prize_catalog(*)
        `)
        .eq('contest_id', contestId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching prizes:', error);
        throw error;
      }
      console.log('Contest prizes data:', data);
      return data;
    }
  });

  const handlePrizeSelect = async (catalogItemId: string) => {
    try {
      console.log('Adding new prize to contest:', contestId, 'catalog item:', catalogItemId);
      
      // Ajouter directement un nouveau prix
      const result = await supabase
        .from('prizes')
        .insert([{
          contest_id: contestId,
          catalog_item_id: catalogItemId
        }]);
          
      console.log('Insert result:', result);

      if (result.error) throw result.error;

      // Invalider les requêtes pour forcer un rafraîchissement
      queryClient.invalidateQueries({ queryKey: ['contest-prizes', contestId] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests-with-counts'] });
      
      toast({
        title: "Succès",
        description: "Le prix a été ajouté au concours",
      });
    } catch (error) {
      console.error('Error selecting prize:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le prix au concours",
        variant: "destructive",
      });
    }
  };

  const handlePrizeRemove = async (prizeId: string) => {
    try {
      console.log('Removing prize from contest:', contestId, 'prize:', prizeId);
      
      const { error } = await supabase
        .from('prizes')
        .delete()
        .eq('id', prizeId);

      if (error) throw error;

      // Invalider les requêtes pour forcer un rafraîchissement
      queryClient.invalidateQueries({ queryKey: ['contest-prizes', contestId] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests-with-counts'] });
      
      toast({
        title: "Succès",
        description: "Le prix a été retiré du concours",
      });
    } catch (error) {
      console.error('Error removing prize:', error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer le prix",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Chargement des prix...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {contestPrizes?.map((prize) => (
          <PrizeDisplay
            key={prize.id}
            imageUrl={prize.catalog_item?.image_url}
            shopUrl={prize.catalog_item?.shop_url}
            onRemove={() => handlePrizeRemove(prize.id)}
          />
        ))}
      </div>
      <PrizeCatalogSelector onSelectPrize={handlePrizeSelect} />
    </div>
  );
};

export default ContestCardPrize;