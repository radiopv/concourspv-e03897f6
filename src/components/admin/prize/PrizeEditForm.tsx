import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, X } from "lucide-react";

interface PrizeEditFormProps {
  editForm: {
    name: string;
    description: string;
    value: string;
    image_url: string;
    shop_url: string;
  };
  onFormChange: (field: string, value: string) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onSave: () => void;
  uploading: boolean;
}

export const PrizeEditForm = ({
  editForm,
  onFormChange,
  onImageUpload,
  onCancel,
  onSave,
  uploading,
}: PrizeEditFormProps) => {
  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="name">Nom du prix</Label>
        <Input
          id="name"
          value={editForm.name}
          onChange={(e) => onFormChange("name", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={editForm.description}
          onChange={(e) => onFormChange("description", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="value">Valeur (€)</Label>
        <Input
          id="value"
          type="number"
          step="0.01"
          value={editForm.value}
          onChange={(e) => onFormChange("value", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="shop_url">Lien vers la boutique</Label>
        <Input
          id="shop_url"
          type="url"
          value={editForm.shop_url}
          onChange={(e) => onFormChange("shop_url", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="image">Image du prix</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          disabled={uploading}
        />
        {editForm.image_url && (
          <div className="mt-2">
            <img
              src={editForm.image_url}
              alt="Aperçu"
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          <X className="w-4 h-4 mr-2" />
          Annuler
        </Button>
        <Button
          type="button"
          onClick={onSave}
        >
          <Check className="w-4 h-4 mr-2" />
          Enregistrer
        </Button>
      </div>
    </form>
  );
};