import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../App";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PrizeCatalogItem } from "@/types/prize-catalog";

interface ContestPrizeManagerProps {
  contestId: string;
}

const ContestPrizeManager = ({ contestId }: ContestPrizeManagerProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contestPrizes, isLoading } = useQuery({
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

  const updatePrizeMutation = useMutation({
    mutationFn: async (prize: PrizeCatalogItem) => {
      const { error } = await supabase
        .from('prize_catalog')
        .update({
          name: prize.name,
          description: prize.description,
          value: prize.value,
          shop_url: prize.shop_url,
          image_url: prize.image_url
        })
        .eq('id', prize.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prizes', contestId] });
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

  const addPrizeMutation = useMutation({
    mutationFn: async (catalogItemId: string) => {
      const { error } = await supabase
        .from('prizes')
        .insert([{
          contest_id: contestId,
          catalog_item_id: catalogItemId
        }]);
      
      if (error) throw error;
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, prizeId: string) => {
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

      // Update the prize with the new image URL
      await updatePrizeMutation.mutateAsync({
        id: prizeId,
        image_url: publicUrl
      } as PrizeCatalogItem);

      toast({
        title: "Succès",
        description: "L'image a été mise à jour",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return <div>Chargement des prix...</div>;
  }

  return (
    <div className="space-y-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">Ajouter un prix au concours</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sélectionner un prix du catalogue</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nous afficherons ici la liste des prix du catalogue disponibles */}
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contestPrizes?.map((prize) => (
          <Card key={prize.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              {prize.catalog_item?.image_url && (
                <div className="aspect-square relative mb-4">
                  <img
                    src={prize.catalog_item.image_url}
                    alt={prize.catalog_item.name}
                    className="object-cover rounded-lg w-full h-full"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, prize.catalog_item.id)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={uploading}
                  />
                </div>
              )}
              <input
                type="text"
                value={prize.catalog_item?.name || ''}
                onChange={(e) => updatePrizeMutation.mutate({
                  ...prize.catalog_item,
                  name: e.target.value
                } as PrizeCatalogItem)}
                className="font-semibold mb-2 w-full p-2 border rounded"
              />
              <textarea
                value={prize.catalog_item?.description || ''}
                onChange={(e) => updatePrizeMutation.mutate({
                  ...prize.catalog_item,
                  description: e.target.value
                } as PrizeCatalogItem)}
                className="text-sm text-gray-500 mb-2 w-full p-2 border rounded"
              />
              <div className="flex justify-between items-center">
                <input
                  type="number"
                  value={prize.catalog_item?.value || ''}
                  onChange={(e) => updatePrizeMutation.mutate({
                    ...prize.catalog_item,
                    value: parseFloat(e.target.value)
                  } as PrizeCatalogItem)}
                  className="text-sm font-medium w-24 p-2 border rounded"
                />
                <input
                  type="url"
                  value={prize.catalog_item?.shop_url || ''}
                  onChange={(e) => updatePrizeMutation.mutate({
                    ...prize.catalog_item,
                    shop_url: e.target.value
                  } as PrizeCatalogItem)}
                  className="text-sm text-blue-600 p-2 border rounded"
                  placeholder="URL de la boutique"
                />
                {prize.catalog_item?.shop_url && (
                  <a
                    href={prize.catalog_item.shop_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
              <button
                onClick={() => deletePrizeMutation.mutate(prize.id)}
                className="mt-4 w-full px-4 py-2 text-sm text-red-600 hover:text-red-800 border border-red-600 hover:border-red-800 rounded-md transition-colors"
              >
                Retirer ce prix
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContestPrizeManager;