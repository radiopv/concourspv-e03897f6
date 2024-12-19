import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

const PrizeCatalogSelector = ({ onSelectPrize }: { onSelectPrize: (id: string) => void }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const { data: prizes, isLoading } = useQuery({
    queryKey: ['prize-catalog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prize_catalog')
        .select('*');

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger le catalogue de prix.",
          variant: "destructive",
        });
        throw error;
      }
      return data;
    }
  });

  const handleSelect = (id: string) => {
    onSelectPrize(id);
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Sélectionner un prix</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sélectionner un prix</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {isLoading ? (
              <div>Chargement des prix...</div>
            ) : (
              prizes?.map((prize) => (
                <div key={prize.id} className="flex justify-between items-center">
                  <span>{prize.name}</span>
                  <Button onClick={() => handleSelect(prize.id)}>Sélectionner</Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PrizeCatalogSelector;

