import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Link as LinkIcon } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import PrizeEditForm from './PrizeEditForm';

interface PrizeCardProps {
  prize: any;
  onEdit: (prize: any) => void;
  onDelete: (id: string) => void;
  editForm: any;
  onFormChange: (field: string, value: string) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  uploading: boolean;
  isEditing: boolean;
}

const PrizeCard = ({
  prize,
  onEdit,
  onDelete,
  editForm,
  onFormChange,
  onImageUpload,
  onCancelEdit,
  onSaveEdit,
  uploading,
  isEditing
}: PrizeCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <Collapsible open={isEditing}>
        <CardContent className="pt-6">
          {prize.image_url && (
            <div className="aspect-square relative mb-4">
              <img
                src={prize.image_url}
                alt={prize.name}
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
          <h3 className="font-semibold mb-2">{prize.name}</h3>
          {prize.description && (
            <p className="text-sm text-gray-500 mb-2">{prize.description}</p>
          )}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              {prize.value ? `${prize.value}€` : 'Prix non défini'}
            </span>
            {prize.shop_url && (
              <a
                href={prize.shop_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                <LinkIcon className="h-4 w-4" />
              </a>
            )}
          </div>
        </CardContent>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <PrizeEditForm
              formData={editForm}
              onFormChange={onFormChange}
              onImageUpload={onImageUpload}
              onCancelEdit={onCancelEdit}
              onSaveEdit={onSaveEdit}
              uploading={uploading}
            />
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default PrizeCard;