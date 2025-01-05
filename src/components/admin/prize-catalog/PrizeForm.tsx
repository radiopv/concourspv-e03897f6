import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, X } from "lucide-react";

interface PrizeFormData {
  name: string;
  description: string;
  value: string;
  image_url: string;
  shop_url: string;
}

interface PrizeFormProps {
  formData: PrizeFormData;
  onFormChange: (field: string, value: string) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onSave: () => void;
  uploading: boolean;
}

export const PrizeForm = ({
  formData,
  onFormChange,
  onImageUpload,
  onCancel,
  onSave,
  uploading,
}: PrizeFormProps) => {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div>
        <Label htmlFor="name">Nom du prix</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onFormChange("name", e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description détaillée</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onFormChange("description", e.target.value)}
          placeholder="Décrivez les caractéristiques et avantages du prix..."
          className="h-32"
        />
      </div>

      <div>
        <Label htmlFor="value">Valeur ($ CAD)</Label>
        <Input
          id="value"
          type="number"
          step="0.01"
          value={formData.value}
          onChange={(e) => onFormChange("value", e.target.value)}
          placeholder="0.00"
        />
      </div>

      <div>
        <Label htmlFor="shop_url">Lien vers la boutique</Label>
        <Input
          id="shop_url"
          type="url"
          value={formData.shop_url}
          onChange={(e) => onFormChange("shop_url", e.target.value)}
          placeholder="https://..."
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
        {formData.image_url && (
          <div className="mt-2">
            <img
              src={formData.image_url}
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