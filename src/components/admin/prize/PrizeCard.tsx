import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Edit, Trash2 } from "lucide-react";
import { PrizeEditForm } from "./PrizeEditForm";

interface PrizeCardProps {
  prize: any;
  editForm: any;
  onEdit: (prize: any) => void;
  onDelete: (id: string) => void;
  onFormChange: (field: string, value: string) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  uploading: boolean;
}

export const PrizeCard = ({
  prize,
  editForm,
  onEdit,
  onDelete,
  onFormChange,
  onImageUpload,
  onCancelEdit,
  onSaveEdit,
  uploading,
}: PrizeCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        {prize.catalog_item?.image_url && (
          <div className="aspect-square relative mb-4">
            <img
              src={prize.catalog_item.image_url}
              alt={prize.catalog_item.name}
              className="object-cover rounded-lg w-full h-full"
            />
            <div className="absolute top-2 right-2 space-x-2">
              <CollapsibleTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => onEdit(prize)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onDelete(prize.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        <h3 className="font-semibold mb-2">{prize.catalog_item?.name}</h3>
        {prize.catalog_item?.description && (
          <p className="text-sm text-gray-500">{prize.catalog_item.description}</p>
        )}
      </CardContent>
      <CollapsibleContent>
        <CardContent className="pt-0">
          <PrizeEditForm
            editForm={editForm}
            onFormChange={onFormChange}
            onImageUpload={onImageUpload}
            onCancel={onCancelEdit}
            onSave={onSaveEdit}
            uploading={uploading}
          />
        </CardContent>
      </CollapsibleContent>
    </Card>
  );
};