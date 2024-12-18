import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../App";
import { PrizeList } from "./prize/PrizeList";
import { PrizeCatalogDialog } from "./prize/PrizeCatalogDialog";

interface ContestPrizeManagerProps {
  contestId: string;
}

const ContestPrizeManager = ({ contestId }: ContestPrizeManagerProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingPrize, setEditingPrize] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    value: '',
    image_url: '',
    shop_url: '',
  });

  const addPrizeMutation = useMutation({
    mutationFn: async (catalogItemId: string) => {
      console.log('Adding prize to contest:', { contestId, catalogItemId });
      const { error } = await supabase
        .from('prizes')
        .insert([{
          contest_id: contestId,
          catalog_item_id: catalogItemId,
          image_url: null // Explicitly set to null if not provided
        }]);
      
      if (error) {
        console.error('Error adding prize:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prizes', contestId] });
      toast({
        title: "Succès",
        description: "Le prix a été ajouté au concours",
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
    mutationFn: async ({ prizeId, data }: { prizeId: string, data: any }) => {
      const { error } = await supabase
        .from('prize_catalog')
        .update(data)
        .eq('id', prizeId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prizes', contestId] });
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
    mutationFn: async (prizeId: string) => {
      const { error } = await supabase
        .from('prizes')
        .delete()
        .eq('id', prizeId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prizes', contestId] });
      toast({
        title: "Succès",
        description: "Le prix a été retiré du concours",
      });
    },
    onError: (error) => {
      console.error("Delete prize error:", error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer le prix",
        variant: "destructive",
      });
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

  const startEditing = (prize: any) => {
    setEditingPrize(prize.catalog_item.id);
    setEditForm({
      name: prize.catalog_item.name,
      description: prize.catalog_item.description || '',
      value: prize.catalog_item.value?.toString() || '',
      image_url: prize.catalog_item.image_url || '',
      shop_url: prize.catalog_item.shop_url || '',
    });
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

    updatePrizeMutation.mutate({ prizeId: editingPrize, data });
  };

  const handleFormChange = (field: string, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <PrizeCatalogDialog onSelectPrize={(id) => addPrizeMutation.mutate(id)} />
      <PrizeList
        contestId={contestId}
        onEdit={startEditing}
        onDelete={(id) => deletePrizeMutation.mutate(id)}
        editForm={editForm}
        onFormChange={handleFormChange}
        onImageUpload={handleImageUpload}
        onCancelEdit={() => setEditingPrize(null)}
        onSaveEdit={handleSaveEdit}
        uploading={uploading}
      />
    </div>
  );
};

export default ContestPrizeManager;