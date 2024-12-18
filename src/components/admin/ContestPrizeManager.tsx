import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "../../App";
import { Plus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible } from "@/components/ui/collapsible";
import { PrizeCard } from "./prize/PrizeCard";

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

  // Load catalog prizes
  const { data: catalogPrizes, isLoading: loadingCatalog } = useQuery({
    queryKey: ['prize-catalog'],
    queryFn: async () => {
      console.log('Fetching prize catalog...');
      const { data, error } = await supabase
        .from('prize_catalog')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching prize catalog:', error);
        throw error;
      }
      console.log('Prize catalog data:', data);
      return data;
    }
  });

  // Load contest prizes
  const { data: contestPrizes, isLoading: loadingPrizes } = useQuery({
    queryKey: ['prizes', contestId],
    queryFn: async () => {
      console.log('Fetching contest prizes...');
      const { data, error } = await supabase
        .from('prizes')
        .select(`
          *,
          catalog_item:prize_catalog(*)
        `)
        .eq('contest_id', contestId);
      
      if (error) {
        console.error('Error fetching contest prizes:', error);
        throw error;
      }
      console.log('Contest prizes data:', data);
      return data;
    }
  });

  const addPrizeMutation = useMutation({
    mutationFn: async (catalogItemId: string) => {
      console.log('Adding prize to contest:', { contestId, catalogItemId });
      const { error } = await supabase
        .from('prizes')
        .insert([{
          contest_id: contestId,
          catalog_item_id: catalogItemId
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

  if (loadingCatalog || loadingPrizes) {
    return <div>Chargement des prix...</div>;
  }

  return (
    <div className="space-y-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un prix du catalogue
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Catalogue des prix</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[500px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {catalogPrizes?.map((prize) => (
                <Card key={prize.id} className="hover:shadow-lg transition-shadow">
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
                    <h3 className="font-semibold mb-2">{prize.name}</h3>
                    {prize.description && (
                      <p className="text-sm text-gray-500 mb-2">{prize.description}</p>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        {prize.value ? `${prize.value}€` : 'Prix non défini'}
                      </span>
                      <Button
                        onClick={() => addPrizeMutation.mutate(prize.id)}
                        size="sm"
                      >
                        Ajouter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contestPrizes?.map((prize) => (
          <Collapsible key={prize.id}>
            <PrizeCard
              prize={prize}
              editForm={editForm}
              onEdit={startEditing}
              onDelete={(id) => deletePrizeMutation.mutate(id)}
              onFormChange={handleFormChange}
              onImageUpload={handleImageUpload}
              onCancelEdit={() => setEditingPrize(null)}
              onSaveEdit={handleSaveEdit}
              uploading={uploading}
            />
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default ContestPrizeManager;
