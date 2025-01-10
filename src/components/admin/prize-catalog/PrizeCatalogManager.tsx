import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import PrizeTabs from "./PrizeTabs";
import { PrizeForm } from "./PrizeForm";

interface PrizeCatalogManagerProps {
  contestId: string | null;
}

const PrizeCatalogManager = ({ contestId }: PrizeCatalogManagerProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPrize, setEditingPrize] = useState<any>(null);

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

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'image",
        variant: "destructive",
      });
      return null;
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
      setIsFormOpen(false);
      setEditingPrize(null);
      toast({
        title: "Succès",
        description: "Le prix a été ajouté au catalogue",
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
      setIsFormOpen(false);
      setEditingPrize(null);
      toast({
        title: "Succès",
        description: "Le prix a été mis à jour",
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
    }
  });

  const archivePrizeMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'active' | 'archived' }) => {
      const { error } = await supabase
        .from('prize_catalog')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prize-catalog'] });
      toast({
        title: "Succès",
        description: "Le statut du prix a été mis à jour",
      });
    }
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, isVisible }: { id: string; isVisible: boolean }) => {
      const { error } = await supabase
        .from('prize_catalog')
        .update({ is_visible: isVisible })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prize-catalog'] });
      toast({
        title: "Succès",
        description: "La visibilité du prix a été mise à jour",
      });
    }
  });

  const handleEdit = (prize: any) => {
    setEditingPrize(prize);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setEditingPrize(null);
    setIsFormOpen(false);
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
                formData={editingPrize || {
                  name: '',
                  description: '',
                  value: '',
                  image_url: '',
                  shop_url: '',
                }}
                onFormChange={(field, value) => {
                  if (editingPrize) {
                    setEditingPrize({ ...editingPrize, [field]: value });
                  }
                }}
                onImageUpload={handleImageUpload}
                onCancel={handleCancel}
                onSave={() => {
                  if (editingPrize) {
                    updatePrizeMutation.mutate({ id: editingPrize.id, data: editingPrize });
                  } else {
                    addPrizeMutation.mutate(editingPrize);
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
        onArchive={(id, status) => archivePrizeMutation.mutate({ id, status })}
        onVisibilityToggle={(id, isVisible) => toggleVisibilityMutation.mutate({ id, isVisible })}
      />
    </div>
  );
};

export default PrizeCatalogManager;