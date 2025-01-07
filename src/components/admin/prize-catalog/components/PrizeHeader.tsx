import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PrizeHeaderProps {
  onAddPrize: () => void;
}

export const PrizeHeader = ({ onAddPrize }: PrizeHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Catalogue des Prix</h1>
      <Button onClick={onAddPrize} className="gap-2">
        <Plus className="w-4 h-4" />
        Ajouter un prix au catalogue
      </Button>
    </div>
  );
};