import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Plus, Upload, Link as LinkIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PLACEHOLDER_IMAGES = [
  'photo-1649972904349-6e44c42644a7',
  'photo-1488590528505-98d2b5aba04b',
  'photo-1518770660439-4636190af475',
  'photo-1461749280684-dccba630e2f6',
  'photo-1486312338219-ce68d2c6f44d',
  'photo-1581091226825-a6a2a5aee158'
];

interface PrizeFormData {
  name: string;
  description: string;
  value: number | '';
  image_url: string;
  shop_url: string;
}

const PrizeCatalogManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [editingPrize, setEditingPrize] = useState<any>(null);
  const [formData, setFormData] = useState<PrizeFormData>({
    name: '',
    description: '',
    value: '',
    image_url: '',
    shop_url: '',
  });

  const { data: prizes, isLoading } = useQuery({
    queryKey: ['prize-catalog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prize_catalog')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Le fichier doit être une image');
      }

      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('prizes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('prizes')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
      
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

  const handlePlaceholderSelect = (imageId: string) => {
    const publicUrl = `https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=800&q=80`;
    setFormData({ ...formData, image_url: publicUrl });
  };

  const handleEdit = (prize: any) => {
    setEditingPrize(prize);
    setFormData({
      name: prize.name,
      description: prize.description || '',
      value: prize.value || '',
      image_url: prize.image_url || '',
      shop_url: prize.shop_url || '',
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('prize_catalog')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['prize-catalog'] });
      toast({
        title: "Succès",
        description: "Le prix a été supprimé du catalogue",
      });
    } catch (error) {
      console.error("Delete prize error:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le prix",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPrize) {
        const { error } = await supabase
          .from('prize_catalog')
          .update(formData)
          .eq('id', editingPrize.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('prize_catalog')
          .insert([formData]);
        
        if (error) throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['prize-catalog'] });
      setFormData({
        name: '',
        description: '',
        value: '',
        image_url: '',
        shop_url: '',
      });
      setEditingPrize(null);
      
      toast({
        title: "Succès",
        description: editingPrize ? "Le prix a été mis à jour" : "Le prix a été ajouté au catalogue",
      });
    } catch (error) {
      console.error("Submit prize error:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le prix",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Chargement du catalogue...</div>;
  }

  return (
    <div className="space-y-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un prix au catalogue
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPrize ? 'Modifier le prix' : 'Ajouter un prix au catalogue'}
            </DialogTitle>
          </DialogHeader>
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="value">Valeur (€)</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value ? parseFloat(e.target.value) : '' })}
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

            <div className="space-y-4">
              <Label>Image du prix</Label>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">Télécharger une image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </div>
                
                <div>
                  <Label className="mb-2 block">Ou choisir une image prédéfinie</Label>
                  <Select onValueChange={handlePlaceholderSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une image" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLACEHOLDER_IMAGES.map((imageId) => (
                        <SelectItem key={imageId} value={imageId}>
                          Image {PLACEHOLDER_IMAGES.indexOf(imageId) + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.image_url && (
                <div className="mt-4">
                  <Label>Aperçu</Label>
                  <div className="mt-2 relative aspect-video">
                    <img
                      src={formData.image_url}
                      alt="Aperçu"
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={uploading}
            >
              {editingPrize ? 'Mettre à jour' : 'Ajouter au catalogue'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prizes?.map((prize) => (
          <Card key={prize.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              {prize.image_url && (
                <div className="aspect-video relative mb-4">
                  <img
                    src={prize.image_url}
                    alt={prize.name}
                    className="object-cover rounded-lg w-full h-full"
                  />
                  <div className="absolute top-2 right-2 space-x-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => handleEdit(prize)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(prize.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              <h3 className="font-semibold mb-2">{prize.name}</h3>
              <div 
                className="text-sm text-gray-500 mb-2 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: prize.description || '' }}
              />
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
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PrizeCatalogManager;