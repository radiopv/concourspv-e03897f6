import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../App";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PrizeCard from './PrizeCard';
import PrizeEditForm from './PrizeEditForm';

const PrizeCatalogManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [editingPrize, setEditingPrize] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
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

      setEditForm({ ...editForm, image_url: publicUrl });
      
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
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('prize_catalog')
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prize-catalog'] });
      setEditForm({
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
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from('prize_catalog')
        .update(data)
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

  const handleEdit = (prize: any) => {
    setEditingPrize(prize.id);
    setEditForm({
      name: prize.name,
      description: prize.description || '',
      value: prize.value?.toString() || '',
      image_url: prize.image_url || '',
      shop_url: prize.shop_url || '',
    });
  };

  const handleFormChange = (field: string, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = () => {
    if (!editingPrize) return;
    
    const data = {
      name: editForm.name,
      description: editForm.description,
      value: editForm.value ? parseFloat(editForm.value) : null,
      image_url: editForm.image_url,
      shop_url: editForm.shop_url,
    };

    updatePrizeMutation.mutate({ id: editingPrize, data });
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
            <DialogTitle>Ajouter un prix au catalogue</DialogTitle>
          </DialogHeader>
          <PrizeEditForm
            formData={editForm}
            onFormChange={handleFormChange}
            onImageUpload={handleImageUpload}
            onCancelEdit={() => setEditForm({
              name: '',
              description: '',
              value: '',
              image_url: '',
              shop_url: '',
            })}
            onSaveEdit={() => {
              const data = {
                name: editForm.name,
                description: editForm.description,
                value: editForm.value ? parseFloat(editForm.value) : null,
                image_url: editForm.image_url,
                shop_url: editForm.shop_url,
              };
              addPrizeMutation.mutate(data);
            }}
            uploading={uploading}
          />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prizes?.map((prize) => (
          <PrizeCard
            key={prize.id}
            prize={prize}
            editForm={editForm}
            onEdit={handleEdit}
            onDelete={(id) => deletePrizeMutation.mutate(id)}
            onFormChange={handleFormChange}
            onImageUpload={handleImageUpload}
            onCancelEdit={() => setEditingPrize(null)}
            onSaveEdit={handleSaveEdit}
            uploading={uploading}
            isEditing={editingPrize === prize.id}
          />
        ))}
      </div>
    </div>
  );
};

export default PrizeCatalogManager;