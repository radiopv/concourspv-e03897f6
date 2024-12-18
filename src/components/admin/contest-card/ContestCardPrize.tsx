import React from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../App";
import { useQueryClient } from "@tanstack/react-query";
import PrizeCatalogSelector from './prize/PrizeCatalogSelector';
import PrizeDisplay from './prize/PrizeDisplay';
import { useQuery } from "@tanstack/react-query";

interface ContestCardPrizeProps {
  contestId: string;
}

const ContestCardPrize = ({ contestId }: ContestCardPrizeProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Requête pour obtenir le prix associé au concours
  const { data: contestPrize, isLoading } = useQuery({
    queryKey: ['contest-prize', contestId],
    queryFn: async () => {
      console.log('Fetching prize for contest:', contestId);
      const { data, error } = await supabase
        .from('prizes')
        .select(`
          *,
          catalog_item:prize_catalog(*)
        `)
        .eq('contest_id', contestId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching prize:', error);
        throw error;
      }
      console.log('Contest prize data:', data);
      return data;
    }
  });

  const handlePrizeSelect = async (catalogItemId: string) => {
    try {
      console.log('Selecting prize for contest:', contestId, 'catalog item:', catalogItemId);
      
      // Vérifier si un prix existe déjà pour ce concours
      const { data: existingPrizes, error: checkError } = await supabase
        .from('prizes')
        .select('id')
        .eq('contest_id', contestId);

      console.log('Existing prizes check:', { existingPrizes, checkError });

      if (checkError) {
        console.error('Error checking existing prizes:', checkError);
        throw checkError;
      }

      let result;
      
      if (existingPrizes && existingPrizes.length > 0) {
        // Mettre à jour le prix existant
        result = await supabase
          .from('prizes')
          .update({ catalog_item_id: catalogItemId })
          .eq('contest_id', contestId);
          
        console.log('Update result:', result);
      } else {
        // Créer un nouveau prix
        result = await supabase
          .from('prizes')
          .insert([{
            contest_id: contestId,
            catalog_item_id: catalogItemId
          }]);
          
        console.log('Insert result:', result);
      }

      if (result.error) {
        throw result.error;
      }

      // Invalider les requêtes pour forcer un rafraîchissement
      queryClient.invalidateQueries({ queryKey: ['contest-prize', contestId] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests-with-counts'] });
      
      toast({
        title: "Succès",
        description: existingPrizes && existingPrizes.length > 0
          ? "Le prix a été mis à jour"
          : "Le prix a été associé au concours",
      });
    } catch (error) {
      console.error('Error selecting prize:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'associer le prix au concours",
        variant: "destructive",
      });
    }
  };

  const handlePrizeRemove = async () => {
    try {
      console.log('Removing prize for contest:', contestId);
      
      const { error } = await supabase
        .from('prizes')
        .delete()
        .eq('contest_id', contestId);

      if (error) throw error;

      // Invalider les requêtes pour forcer un rafraîchissement
      queryClient.invalidateQueries({ queryKey: ['contest-prize', contestId] });
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
    return <div>Chargement du prix...</div>;
  }

  return (
    <div className="space-y-4">
      <PrizeDisplay
        imageUrl={contestPrize?.catalog_item?.image_url}
        shopUrl={contestPrize?.catalog_item?.shop_url}
        onRemove={handlePrizeRemove}
      />
      <PrizeCatalogSelector onSelectPrize={handlePrizeSelect} />
    </div>
  );
};

export default ContestCardPrize;