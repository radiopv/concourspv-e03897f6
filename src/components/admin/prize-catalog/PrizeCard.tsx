import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash2, Link } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/App";

interface PrizeCardProps {
  prize: {
    id: string;
    name: string;
    description?: string;
    value?: number;
    image_url?: string;
    shop_url?: string;
  };
  onEdit: (prize: any) => void;
  onDelete: (id: string) => void;
}

export const PrizeCard = ({ prize, onEdit, onDelete }: PrizeCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrize, setEditedPrize] = useState(prize);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('prizes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('prizes')
        .getPublicUrl(filePath);

      setEditedPrize({ ...editedPrize, image_url: publicUrl });
      
      toast({
        title: "Succès",
        description: "L'image a été téléchargée",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    onEdit(editedPrize);
    setIsEditing(false);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="aspect-square relative mb-4">
          {editedPrize.image_url ? (
            <img
              src={editedPrize.image_url}
              alt={editedPrize.name}
              className="object-cover rounded-lg w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
              Aucune image
            </div>
          )}
          <div className="absolute top-2 right-2 space-x-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(prize.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <h3 className="font-semibold mb-2">{editedPrize.name}</h3>
        {editedPrize.description && (
          <p className="text-sm text-gray-500 mb-2">{editedPrize.description}</p>
        )}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">
            {editedPrize.value ? `${editedPrize.value} $ CAD` : 'Prix non défini'}
          </span>
          {editedPrize.shop_url && (
            <a
              href={editedPrize.shop_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              <Link className="h-4 w-4" />
            </a>
          )}
        </div>
      </CardContent>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le prix</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nom du prix</Label>
              <Input
                id="name"
                value={editedPrize.name}
                onChange={(e) => setEditedPrize({ ...editedPrize, name: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editedPrize.description}
                onChange={(e) => setEditedPrize({ ...editedPrize, description: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="value">Valeur ($ CAD)</Label>
              <Input
                id="value"
                type="number"
                value={editedPrize.value}
                onChange={(e) => setEditedPrize({ ...editedPrize, value: parseFloat(e.target.value) })}
              />
            </div>
            
            <div>
              <Label htmlFor="shop_url">Lien vers la boutique</Label>
              <Input
                id="shop_url"
                type="url"
                value={editedPrize.shop_url}
                onChange={(e) => setEditedPrize({ ...editedPrize, shop_url: e.target.value })}
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
              {editedPrize.image_url && (
                <img
                  src={editedPrize.image_url}
                  alt="Aperçu"
                  className="mt-2 w-32 h-32 object-cover rounded"
                />
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Annuler
              </Button>
              <Button onClick={handleSave}>
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};