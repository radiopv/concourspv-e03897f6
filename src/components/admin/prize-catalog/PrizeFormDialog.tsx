import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PrizeFormData {
  name: string;
  description?: string;
  value?: number;
  image_url?: string;
  shop_url?: string;
}

interface PrizeFormDialogProps {
  onSubmit: (data: PrizeFormData) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  initialData?: PrizeFormData;
  uploading: boolean;
  isEditing?: boolean;
}

export const PrizeFormDialog = ({
  onSubmit,
  onImageUpload,
  initialData,
  uploading,
  isEditing = false,
}: PrizeFormDialogProps) => {
  const [formData, setFormData] = useState<PrizeFormData>(
    initialData || {
      name: "",
      description: "",
      value: undefined,
      image_url: "",
      shop_url: "",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          {isEditing ? "Modifier le prix" : "Ajouter un prix au catalogue"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier le prix" : "Ajouter un prix au catalogue"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom du prix</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="value">Valeur (€)</Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              value={formData.value || ""}
              onChange={(e) =>
                setFormData({ ...formData, value: parseFloat(e.target.value) })
              }
            />
          </div>

          <div>
            <Label htmlFor="shop_url">Lien vers la boutique</Label>
            <Input
              id="shop_url"
              type="url"
              value={formData.shop_url}
              onChange={(e) =>
                setFormData({ ...formData, shop_url: e.target.value })
              }
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

          <Button type="submit" className="w-full">
            {isEditing ? "Mettre à jour" : "Ajouter au catalogue"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};