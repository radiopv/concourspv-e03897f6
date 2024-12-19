import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface AddPrizeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<string | null>;
  uploading: boolean;
}

export const AddPrizeDialog = ({
  open,
  onOpenChange,
  onImageUpload,
  uploading
}: AddPrizeDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [shopUrl, setShopUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = await onImageUpload(event);
    if (url) setImageUrl(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un prix</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="value">Valeur (€)</Label>
            <Input
              id="value"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="shopUrl">URL de la boutique</Label>
            <Input
              id="shopUrl"
              type="url"
              value={shopUrl}
              onChange={(e) => setShopUrl(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </div>
          <Button type="submit" disabled={uploading}>
            {uploading ? "Chargement..." : "Ajouter"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};