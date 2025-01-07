import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Prize } from "../types";
import { usePrizeImageUpload } from "../hooks/usePrizeImageUpload";

interface PrizeEditDialogProps {
  prize: Prize;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPrize: Prize) => void;
}

export const PrizeEditDialog = ({ prize, isOpen, onClose, onSave }: PrizeEditDialogProps) => {
  const [editedPrize, setEditedPrize] = useState<Prize>(prize);
  const { uploading, uploadImage } = usePrizeImageUpload();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setEditedPrize({ ...editedPrize, main_image_url: imageUrl });
      }
    }
  };

  const handleSave = () => {
    onSave(editedPrize);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le prix</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              value={editedPrize.name}
              onChange={(e) => setEditedPrize({ ...editedPrize, name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editedPrize.description || ""}
              onChange={(e) => setEditedPrize({ ...editedPrize, description: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="value">Valeur ($ CAD)</Label>
            <Input
              id="value"
              type="number"
              value={editedPrize.value || ""}
              onChange={(e) => setEditedPrize({ ...editedPrize, value: parseFloat(e.target.value) })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="shop_url">Lien boutique</Label>
            <Input
              id="shop_url"
              type="url"
              value={editedPrize.shop_url || ""}
              onChange={(e) => setEditedPrize({ ...editedPrize, shop_url: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
            {editedPrize.main_image_url && (
              <img
                src={editedPrize.main_image_url}
                alt="Aperçu"
                className="w-32 h-32 object-cover rounded"
              />
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};