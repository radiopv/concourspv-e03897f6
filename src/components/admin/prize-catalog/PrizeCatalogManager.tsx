import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import PrizeForm from "./PrizeForm";
import PrizeGrid from "./PrizeGrid";
import PrizeTabs from "./PrizeTabs";

const PrizeCatalogManager = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPrize, setEditingPrize] = useState<string | null>(null);
  const [formData, setFormData] = useState({
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
        .order('created_at', { ascending: false });
      
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
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('prize_catalog')
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prize-catalog'] });
      setIsFormOpen(false);
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
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase
        .from('prize_catalog')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prize-catalog'] });
      setEditingPrize(null);
      setFormData({
        name: '',
        description: '',
        value: '',
        image_url: '',
        shop_url: '',
      });
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
        description: "Le prix a été supprimé",
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
    setFormData({
      name: prize.name,
      description: prize.description || '',
      value: prize.value?.toString() || '',
      image_url: prize.image_url || '',
      shop_url: prize.shop_url || '',
    });
  };

  const handleArchive = async (id: string, status: 'active' | 'archived') => {
    try {
      const { error } = await supabase
        .from('prize_catalog')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['prize-catalog'] });
      toast({
        title: "Succès",
        description: `Le prix a été ${status === 'archived' ? 'archivé' : 'restauré'}`,
      });
    } catch (error) {
      console.error("Archive prize error:", error);
      toast({
        title: "Erreur",
        description: `Impossible de ${status === 'archived' ? 'archiver' : 'restaurer'} le prix`,
        variant: "destructive",
      });
    }
  };

  const handleVisibilityToggle = async (id: string, isVisible: boolean) => {
    try {
      const { error } = await supabase
        .from('prize_catalog')
        .update({ is_visible: isVisible })
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['prize-catalog'] });
      toast({
        title: "Succès",
        description: `Le prix est maintenant ${isVisible ? 'visible' : 'caché'}`,
      });
    } catch (error) {
      console.error("Visibility toggle error:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la visibilité du prix",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Chargement du catalogue...</div>;
  }

  return (
    <div className="space-y-6">
      <Collapsible open={isFormOpen} onOpenChange={setIsFormOpen}>
        <CollapsibleTrigger asChild>
          <Button className="w-full">
            {isFormOpen ? (
              <X className="w-4 h-4 mr-2" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            {isFormOpen ? "Fermer le formulaire" : "Ajouter un prix au catalogue"}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <PrizeForm
                formData={formData}
                onFormChange={(field, value) => setFormData({ ...formData, [field]: value })}
                onImageUpload={handleImageUpload}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingPrize(null);
                  setFormData({
                    name: '',
                    description: '',
                    value: '',
                    image_url: '',
                    shop_url: '',
                  });
                }}
                onSave={() => {
                  if (editingPrize) {
                    updatePrizeMutation.mutate({ id: editingPrize, data: formData });
                  } else {
                    addPrizeMutation.mutate(formData);
                  }
                }}
                uploading={uploading}
              />
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      <PrizeTabs
        prizes={prizes || []}
        onEdit={handleEdit}
        onDelete={(id) => deletePrizeMutation.mutate(id)}
        onArchive={handleArchive}
        onVisibilityToggle={handleVisibilityToggle}
      />
    </div>
  );
};

export default PrizeCatalogManager;