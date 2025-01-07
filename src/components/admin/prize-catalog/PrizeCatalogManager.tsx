import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PrizeForm } from "./components/PrizeForm";
import { PrizeCard } from "./components/PrizeCard";
import { Prize, PrizeFormData } from "@/types/prize";
import { PrizeCsvImport } from "./components/PrizeCsvImport";

export const PrizeCatalogManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null);
  const [formData, setFormData] = useState<PrizeFormData>({
    name: '',
    description: '',
    value: undefined,
    images: [],
    main_image_url: '',
    shop_url: '',
    category: '',
    stock: 0,
    is_archived: false,
    is_hidden: false,
  });

  const { data: prizes, isLoading } = useQuery({
    queryKey: ['prize-catalog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prize_catalog')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Prize[];
    }
  });

  const addPrizeMutation = useMutation({
    mutationFn: async (data: PrizeFormData) => {
      const { error } = await supabase
        .from('prize_catalog')
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prize-catalog'] });
      setIsDialogOpen(false);
      resetForm();
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
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prize-catalog'] });
      setIsDialogOpen(false);
      resetForm();
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

  const handleFormChange = (field: keyof PrizeFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (editingPrize) {
      updatePrizeMutation.mutate({ id: editingPrize.id, data: formData });
    } else {
      addPrizeMutation.mutate(formData);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      value: undefined,
      images: [],
      main_image_url: '',
      shop_url: '',
      category: '',
      stock: 0,
      is_archived: false,
      is_hidden: false,
    });
    setEditingPrize(null);
  };

  const handleEdit = (prize: Prize) => {
    setEditingPrize(prize);
    setFormData({
      name: prize.name,
      description: prize.description || '',
      value: prize.value,
      images: prize.images || [],
      main_image_url: prize.main_image_url || '',
      shop_url: prize.shop_url || '',
      category: prize.category || '',
      stock: prize.stock || 0,
      is_archived: prize.is_archived || false,
      is_hidden: prize.is_hidden || false,
    });
    setIsDialogOpen(true);
  };

  const handleArchive = async (id: string, archived: boolean) => {
    try {
      const { error } = await supabase
        .from('prize_catalog')
        .update({ is_archived: archived })
        .eq('id', id);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['prize-catalog'] });
      toast({
        title: "Succès",
        description: archived ? "Le prix a été archivé" : "Le prix a été désarchivé",
      });
    } catch (error) {
      console.error("Archive prize error:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut d'archive",
        variant: "destructive",
      });
    }
  };

  const handleVisibility = async (id: string, hidden: boolean) => {
    try {
      const { error } = await supabase
        .from('prize_catalog')
        .update({ is_hidden: hidden })
        .eq('id', id);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['prize-catalog'] });
      toast({
        title: "Succès",
        description: hidden ? "Le prix a été masqué" : "Le prix a été affiché",
      });
    } catch (error) {
      console.error("Visibility prize error:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la visibilité",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Chargement du catalogue...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button
          className="flex-1"
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un prix au catalogue
        </Button>
        <PrizeCsvImport />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPrize ? 'Modifier le prix' : 'Ajouter un prix au catalogue'}
            </DialogTitle>
          </DialogHeader>
          <PrizeForm
            formData={formData}
            onFormChange={handleFormChange}
            onCancel={() => {
              setIsDialogOpen(false);
              resetForm();
            }}
            onSave={handleSubmit}
          />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prizes?.map((prize) => (
          <PrizeCard
            key={prize.id}
            prize={prize}
            onEdit={handleEdit}
            onDelete={(id) => deletePrizeMutation.mutate(id)}
            onArchive={handleArchive}
            onVisibility={handleVisibility}
          />
        ))}
      </div>
    </div>
  );
};

export default PrizeCatalogManager;