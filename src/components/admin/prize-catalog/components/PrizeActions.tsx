import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface PrizeActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const PrizeActions = ({ onEdit, onDelete }: PrizeActionsProps) => {
  return (
    <div className="absolute top-2 right-2 space-x-2">
      <Button
        variant="secondary"
        size="icon"
        onClick={onEdit}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="destructive"
        size="icon"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};