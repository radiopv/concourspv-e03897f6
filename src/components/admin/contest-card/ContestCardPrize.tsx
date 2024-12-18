import React from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../App";
import { useQueryClient } from "@tanstack/react-query";
import PrizeCatalogSelector from './prize/PrizeCatalogSelector';
import PrizeDisplay from './prize/PrizeDisplay';

interface ContestCardPrizeProps {
  prizeImageUrl?: string;
  shopUrl?: string;
  contestId: string;
}

const ContestCardPrize = ({ prizeImageUrl, shopUrl, contestId }: ContestCardPrizeProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handlePrizeSelect = async (catalogItemId: string) => {
    try {
      console.log('Selecting prize for contest:', contestId, 'catalog item:', catalogItemId);
      
      // Vérifier si un prix existe déjà pour ce concours
      const { data: existingPrize, error: checkError } = await supabase
        .from('prizes')
        .select('id')
        .eq('contest_id', contestId)
        .single();

      console.log('Existing prize check:', { existingPrize, checkError });

      // Si l'erreur n'est pas "No rows returned" (PGRST116), c'est une vraie erreur
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing prize:', checkError);
        throw checkError;
      }

      let result;
      
      if (existingPrize) {
        // Mettre à jour le prix existant
        result = await supabase
          .from('prizes')
          .update({ catalog_item_id: catalogItemId })
          .eq('id', existingPrize.id);
          
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
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests-with-counts'] });
      queryClient.invalidateQueries({ queryKey: ['prizes', contestId] });
      
      toast({
        title: "Succès",
        description: existingPrize 
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
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests-with-counts'] });
      queryClient.invalidateQueries({ queryKey: ['prizes', contestId] });
      
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

  return (
    <div className="space-y-4">
      <PrizeDisplay
        imageUrl={prizeImageUrl}
        shopUrl={shopUrl}
        onRemove={handlePrizeRemove}
      />
      <PrizeCatalogSelector onSelectPrize={handlePrizeSelect} />
    </div>
  );
};

export default ContestCardPrize;