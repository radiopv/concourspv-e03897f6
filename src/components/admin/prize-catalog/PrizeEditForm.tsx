import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PrizeCatalogItem } from "@/types/prize-catalog";

interface PrizeEditFormProps {
  prize: PrizeCatalogItem;
  onUpdate: (updatedPrize: PrizeCatalogItem) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
}

export const PrizeEditForm = ({
  prize,
  onUpdate,
  onImageUpload,
  uploading
}: PrizeEditFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Nom du prix</Label>
        <Input
          id="name"
          value={prize.name}
          onChange={(e) => onUpdate({ ...prize, name: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={prize.description || ''}
          onChange={(e) => onUpdate({ ...prize, description: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="value">Valeur (€)</Label>
        <Input
          id="value"
          type="number"
          value={prize.value || ''}
          onChange={(e) => onUpdate({ ...prize, value: parseFloat(e.target.value) })}
        />
      </div>

      <div>
        <Label htmlFor="shop_url">Lien vers la boutique</Label>
        <Input
          id="shop_url"
          type="url"
          value={prize.shop_url || ''}
          onChange={(e) => onUpdate({ ...prize, shop_url: e.target.value })}
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
        {prize.image_url && (
          <img
            src={prize.image_url}
            alt={prize.name}
            className="mt-2 w-32 h-32 object-cover rounded"
          />
        )}
      </div>
    </div>
  );
};