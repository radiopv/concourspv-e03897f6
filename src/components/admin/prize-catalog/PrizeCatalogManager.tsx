import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../App";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PrizeForm } from "./components/PrizeForm";
import { PrizeGrid } from "./components/PrizeGrid";
import { usePrizeMutations } from "@/hooks/usePrizeMutations";
import { Prize } from "@/types/prize";

const PrizeCatalogManager = () => {
  const { data: prizes, isLoading } = useQuery({
    queryKey: ['prize-catalog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prize_catalog')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Prize[];
    }
  });

  const { addPrizeToCatalog, updatePrize, deletePrize } = usePrizeMutations();

  if (isLoading) {
    return <div>Chargement du catalogue...</div>;
  }

  return (
    <div className="space-y-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un prix au catalogue
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter un prix au catalogue</DialogTitle>
          </DialogHeader>
          <PrizeForm onSubmit={(data) => addPrizeToCatalog.mutate(data)} />
        </DialogContent>
      </Dialog>

      <PrizeGrid
        prizes={prizes || []}
        onEdit={(prize) => updatePrize.mutate({ prizeId: prize.id, data: prize })}
        onDelete={(id) => deletePrize.mutate(id)}
      />
    </div>
  );
};

export default PrizeCatalogManager;