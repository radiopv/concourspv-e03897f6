import { useState } from 'react';
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
import { useToast } from "@/hooks/use-toast";

const PrizeCatalogManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const { data: prizes, isLoading } = useQuery({
    queryKey: ['prize-catalog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prize_catalog')
        .select('*')
        .order('name');
      
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les prix",
          variant: "destructive",
        });
        throw error;
      }
      return data as Prize[];
    }
  });

  const { addPrizeToCatalog, updatePrize, deletePrize } = usePrizeMutations();

  const handleAddPrize = async (data: Partial<Prize>) => {
    await addPrizeToCatalog.mutateAsync(data);
    setIsDialogOpen(false);
    toast({
      title: "Succès",
      description: "Le prix a été ajouté au catalogue",
    });
  };

  const handleEditPrize = async (prize: Prize) => {
    await updatePrize.mutateAsync({ prizeId: prize.id, data: prize });
    toast({
      title: "Succès",
      description: "Le prix a été mis à jour",
    });
  };

  const handleDeletePrize = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce prix ?')) {
      await deletePrize.mutateAsync(id);
      toast({
        title: "Succès",
        description: "Le prix a été supprimé",
      });
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Chargement du catalogue...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Catalogue des Prix</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un prix
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau prix</DialogTitle>
            </DialogHeader>
            <PrizeForm onSubmit={handleAddPrize} />
          </DialogContent>
        </Dialog>
      </div>

      <PrizeGrid
        prizes={prizes || []}
        onEdit={handleEditPrize}
        onDelete={handleDeletePrize}
      />
    </div>
  );
};

export default PrizeCatalogManager;