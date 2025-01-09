import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Award, DollarSign, Image, Link as LinkIcon, Edit, Trash2, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [prizeToDelete, setPrizeToDelete] = useState<string | null>(null);
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
      console.log('Fetching prize catalog...');
      const { data, error } = await supabase
        .from('prize_catalog')
        .select('*')
        .order('name');
      
      if (error) throw error;
      console.log('Prize catalog data:', data);
      return data;
    }
  });

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

  const addPrizeMutation = useMutation({
    mutationFn: async (data: PrizeFormData) => {
      const { error } = await supabase
        .from('prize_catalog')
        .insert([{
          ...data,
          value: data.value === '' ? null : data.value
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prize-catalog'] });
      setFormData({
        name: '',
        description: '',
        value: '',
        image_url: '',
        shop_url: '',
      });
      toast({
        title: "Succès",
        description: "Le prix a été ajouté au catalogue",
      });
    },
    onError: (error) => {
      console.error("Add prize error:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le prix",
        variant: "destructive",
      });
    }
  });

  const updatePrizeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PrizeFormData }) => {
      const { error } = await supabase
        .from('prize_catalog')
        .update({
          ...data,
          value: data.value === '' ? null : data.value
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prize-catalog'] });
      setEditingPrize(null);
      toast({
        title: "Succès",
        description: "Le prix a été mis à jour",
      });
    },
    onError: (error) => {
      console.error("Update prize error:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le prix",
        variant: "destructive",
      });
    }
  });

  const deletePrizeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('prize_catalog')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prize-catalog'] });
      setShowDeleteDialog(false);
      setPrizeToDelete(null);
      toast({
        title: "Succès",
        description: "Le prix a été supprimé du catalogue",
      });
    },
    onError: (error) => {
      console.error("Delete prize error:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le prix",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPrize) {
      updatePrizeMutation.mutate({ id: editingPrize.id, data: formData });
    } else {
      addPrizeMutation.mutate(formData);
    }
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

  const handleDelete = (prizeId: string) => {
    setPrizeToDelete(prizeId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (prizeToDelete) {
      deletePrizeMutation.mutate(prizeToDelete);
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
        <DialogContent>
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

            <Button type="submit" className="w-full">
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
                <div className="aspect-square relative mb-4">
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Le prix sera définitivement supprimé du catalogue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PrizeCatalogManager;