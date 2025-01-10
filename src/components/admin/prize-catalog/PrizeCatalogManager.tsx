import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  const [openPrizeId, setOpenPrizeId] = useState<string | null>(null);
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

  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, is_visible }: { id: string; is_visible: boolean }) => {
      const { error } = await supabase
        .from('prize_catalog')
        .update({ is_visible })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prize-catalog'] });
      toast({
        title: "Succès",
        description: "La visibilité du prix a été mise à jour",
      });
    },
    onError: (error) => {
      console.error("Toggle visibility error:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la visibilité",
        variant: "destructive",
      });
    }
  });

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
    mutationFn: async (prizeId: string) => {
      const { error } = await supabase
        .from('prize_catalog')
        .delete()
        .eq('id', prizeId);
      
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
    setEditingPrize(prize);
    setOpenPrizeId(prize.id);
    setFormData({
      name: prize.name,
      description: prize.description || '',
      value: prize.value?.toString() || '',
      image_url: prize.image_url || '',
      shop_url: prize.shop_url || '',
    });
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
                    updatePrizeMutation.mutate({ id: editingPrize.id, data: formData });
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prizes?.map((prize) => (
          <Collapsible 
            key={prize.id} 
            open={openPrizeId === prize.id}
            onOpenChange={(open) => {
              if (open) {
                handleEdit(prize);
              } else {
                setOpenPrizeId(null);
                setEditingPrize(null);
              }
            }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                {prize.image_url && (
                  <div className="aspect-square relative mb-4">
                    <img
                      src={prize.image_url}
                      alt={prize.name}
                      className="object-cover rounded-lg w-full h-full"
                    />
                  </div>
                )}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold">{prize.name}</h3>
                  <Select
                    value={prize.is_visible ? "public" : "private"}
                    onValueChange={(value) => 
                      toggleVisibilityMutation.mutate({ 
                        id: prize.id, 
                        is_visible: value === "public" 
                      })
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Privé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {prize.description && (
                  <p className="text-sm text-gray-500 mb-2">{prize.description}</p>
                )}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium">
                    {prize.value ? `${prize.value}€` : 'Prix non défini'}
                  </span>
                </div>
                <div className="space-y-2">
                  <CollapsibleTrigger asChild>
                    <Button
                      className="w-full"
                      variant="outline"
                    >
                      {openPrizeId === prize.id ? "Fermer" : "Modifier"}
                    </Button>
                  </CollapsibleTrigger>
                  <Button
                    onClick={() => deletePrizeMutation.mutate(prize.id)}
                    className="w-full"
                    variant="destructive"
                  >
                    Supprimer
                  </Button>
                </div>
              </CardContent>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <PrizeForm
                    formData={formData}
                    onFormChange={(field, value) => setFormData({ ...formData, [field]: value })}
                    onImageUpload={handleImageUpload}
                    onCancel={() => {
                      setOpenPrizeId(null);
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
                      updatePrizeMutation.mutate({ 
                        id: prize.id, 
                        data: formData 
                      });
                      setOpenPrizeId(null);
                    }}
                    uploading={uploading}
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default PrizeCatalogManager;