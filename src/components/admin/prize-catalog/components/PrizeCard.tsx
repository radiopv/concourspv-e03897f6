import { Card, CardContent } from "@/components/ui/card";
import { Link } from "lucide-react";
import { useState } from "react";
import { Prize } from "../types";
import { PrizeActions } from "./PrizeActions";
import { PrizeImage } from "./PrizeImage";
import { PrizeEditDialog } from "./PrizeEditDialog";

interface PrizeCardProps {
  prize: Prize;
  onEdit: (prize: Prize) => void;
  onDelete: (id: string) => void;
}

export const PrizeCard = ({ prize, onEdit, onDelete }: PrizeCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (updatedPrize: Prize) => {
    onEdit(updatedPrize);
    setIsEditing(false);
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
          <PrizeImage imageUrl={prize.main_image_url} altText={prize.name}>
            <PrizeActions onEdit={handleEdit} onDelete={() => onDelete(prize.id)} />
          </PrizeImage>
          
          <h3 className="font-semibold mb-2">{prize.name}</h3>
          {prize.description && (
            <p className="text-sm text-gray-500 mb-2">{prize.description}</p>
          )}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              {prize.value ? `${prize.value} $ CAD` : 'Prix non défini'}
            </span>
            {prize.shop_url && (
              <a
                href={prize.shop_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                <Link className="h-4 w-4" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      <PrizeEditDialog
        prize={prize}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleSave}
      />
    </>
  );
};