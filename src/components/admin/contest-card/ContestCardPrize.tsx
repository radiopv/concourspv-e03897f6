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
      const { error } = await supabase
        .from('prizes')
        .insert([{
          contest_id: contestId,
          catalog_item_id: catalogItemId
        }]);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests-with-counts'] });
      
      toast({
        title: "Succès",
        description: "Le prix a été associé au concours",
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
      const { error } = await supabase
        .from('prizes')
        .delete()
        .eq('contest_id', contestId);

      if (error) throw error;

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