import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PrizeForm } from "./components/PrizeForm";
import { PrizeGrid } from "./components/PrizeGrid";
import { PrizeHeader } from "./components/PrizeHeader";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Prize } from "./types";

const PrizeCatalogManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null);

  const { data: prizes, isLoading } = useQuery({
    queryKey: ['prize-catalog'],
    queryFn: async () => {
      console.log("Fetching prize catalog...");
      const { data, error } = await supabase
        .from('prize_catalog')
        .select('*')
        .order('name');
      
      if (error) throw error;
      console.log("Prize catalog data:", data);
      return data as Prize[];
    }
  });

  if (isLoading) {
    return <div>Chargement du catalogue...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <PrizeHeader onAddPrize={() => setIsDialogOpen(true)} />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPrize ? "Modifier le prix" : "Ajouter un prix au catalogue"}
            </DialogTitle>
          </DialogHeader>
          <PrizeForm
            initialData={editingPrize || undefined}
            onSubmit={() => {
              setIsDialogOpen(false);
              setEditingPrize(null);
            }}
            isEditing={!!editingPrize}
          />
        </DialogContent>
      </Dialog>

      <PrizeGrid 
        prizes={prizes || []}
        onEdit={(prize) => {
          setEditingPrize(prize);
          setIsDialogOpen(true);
        }}
      />
    </div>
  );
};

export default PrizeCatalogManager;