import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { PrizeFormData } from "../types";
import { usePrizeImageUpload } from "../hooks/usePrizeImageUpload";

interface PrizeFormProps {
  initialData?: PrizeFormData;
  onSubmit: (data: PrizeFormData) => void;
  isEditing?: boolean;
}

export const PrizeForm = ({ initialData, onSubmit, isEditing = false }: PrizeFormProps) => {
  const [formData, setFormData] = useState<PrizeFormData>(
    initialData || {
      name: "",
      description: "",
      value: undefined,
      image_url: "",
      shop_url: "",
      category: "",
      stock: 0,
      is_active: true,
    }
  );

  const { uploading, uploadImage } = usePrizeImageUpload();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const publicUrl = await uploadImage(file);
    if (publicUrl) {
      setFormData({ ...formData, image_url: publicUrl });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom du prix</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description détaillée</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="h-32"
        />
      </div>

      <div>
        <Label htmlFor="value">Valeur ($ CAD)</Label>
        <Input
          id="value"
          type="number"
          step="0.01"
          value={formData.value || ''}
          onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
        />
      </div>

      <div>
        <Label htmlFor="category">Catégorie</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="stock">Stock disponible</Label>
        <Input
          id="stock"
          type="number"
          value={formData.stock || 0}
          onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
        />
      </div>

      <div>
        <Label htmlFor="shop_url">Lien vers la boutique</Label>
        <Input
          id="shop_url"
          type="url"
          value={formData.shop_url}
          onChange={(e) => setFormData({ ...formData, shop_url: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div>
        <Label htmlFor="image">Image du prix</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
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

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active">Prix actif</Label>
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
        {isEditing ? "Mettre à jour" : "Ajouter au catalogue"}
      </Button>
    </form>
  );
};