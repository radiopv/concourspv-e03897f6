import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface PrizeCatalogSelectorProps {
  contestId: string;
  onSelect: (prizeId: string) => void;
}

const PrizeCatalogSelector = ({ contestId, onSelect }: PrizeCatalogSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const { data: prizes, isLoading } = useQuery({
    queryKey: ['prize-catalog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prize_catalog')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const handleSelect = (prizeId: string) => {
    onSelect(prizeId);
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Select from Catalog
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Prize</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            {prizes?.map((prize) => (
              <Button
                key={prize.id}
                variant="outline"
                onClick={() => handleSelect(prize.id)}
                className="w-full justify-start"
              >
                {prize.name}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PrizeCatalogSelector;