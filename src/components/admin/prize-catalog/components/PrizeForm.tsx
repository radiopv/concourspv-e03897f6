import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Check, X } from "lucide-react";
import { PrizeFormData } from "@/types/prize";
import { PrizeImages } from "./PrizeImages";
import { PrizeDescription } from "./PrizeDescription";

interface PrizeFormProps {
  formData: PrizeFormData;
  onFormChange: (field: keyof PrizeFormData, value: any) => void;
  onCancel: () => void;
  onSave: () => void;
}

export const PrizeForm = ({
  formData,
  onFormChange,
  onCancel,
  onSave,
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

      <PrizeDescription
        description={formData.description}
        onChange={(value) => onFormChange("description", value)}
      />

      <PrizeImages
        images={formData.images || []}
        mainImage={formData.main_image_url}
        onImagesChange={(images) => onFormChange("images", images)}
        onMainImageChange={(url) => onFormChange("main_image_url", url)}
      />

      <div>
        <Label htmlFor="value">Valeur ($ CAD)</Label>
        <Input
          id="value"
          type="number"
          step="0.01"
          value={formData.value || ''}
          onChange={(e) => onFormChange("value", parseFloat(e.target.value))}
        />
      </div>

      <div>
        <Label htmlFor="shop_url">Lien vers la boutique</Label>
        <Input
          id="shop_url"
          type="url"
          value={formData.shop_url || ''}
          onChange={(e) => onFormChange("shop_url", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="category">Catégorie</Label>
        <Input
          id="category"
          value={formData.category || ''}
          onChange={(e) => onFormChange("category", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="stock">Stock</Label>
        <Input
          id="stock"
          type="number"
          value={formData.stock || ''}
          onChange={(e) => onFormChange("stock", parseInt(e.target.value))}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="archived"
          checked={formData.is_archived || false}
          onCheckedChange={(checked) => onFormChange("is_archived", checked)}
        />
        <Label htmlFor="archived">Archiver</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="hidden"
          checked={formData.is_hidden || false}
          onCheckedChange={(checked) => onFormChange("is_hidden", checked)}
        />
        <Label htmlFor="hidden">Masquer</Label>
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