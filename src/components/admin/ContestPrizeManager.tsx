import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "../../App";
import { Image, Trash2, Plus, Edit, X, Check } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

  // Charger les prix du catalogue
  const { data: catalogPrizes, isLoading: loadingCatalog } = useQuery({
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

  // Charger les prix actuels du concours
  const { data: contestPrizes, isLoading: loadingPrizes } = useQuery({
    queryKey: ['prizes', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prizes')
        .select(`
          *,
          catalog_item:prize_catalog(*)
        `)
        .eq('contest_id', contestId);
      
      if (error) throw error;
      return data;
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
            <Card>
              <CardContent className="pt-6">
                {prize.catalog_item?.image_url && (
                  <div className="aspect-square relative mb-4">
                    <img
                      src={prize.catalog_item.image_url}
                      alt={prize.catalog_item.name}
                      className="object-cover rounded-lg w-full h-full"
                    />
                    <div className="absolute top-2 right-2 space-x-2">
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => startEditing(prize)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </CollapsibleTrigger>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deletePrizeMutation.mutate(prize.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                <h3 className="font-semibold mb-2">{prize.catalog_item?.name}</h3>
                {prize.catalog_item?.description && (
                  <p className="text-sm text-gray-500">{prize.catalog_item.description}</p>
                )}
              </CardContent>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nom du prix</Label>
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="value">Valeur (€)</Label>
                      <Input
                        id="value"
                        type="number"
                        step="0.01"
                        value={editForm.value}
                        onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="shop_url">Lien vers la boutique</Label>
                      <Input
                        id="shop_url"
                        type="url"
                        value={editForm.shop_url}
                        onChange={(e) => setEditForm({ ...editForm, shop_url: e.target.value })}
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
                      {editForm.image_url && (
                        <div className="mt-2">
                          <img
                            src={editForm.image_url}
                            alt="Aperçu"
                            className="w-32 h-32 object-cover rounded"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditingPrize(null)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Annuler
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSaveEdit}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Enregistrer
                      </Button>
                    </div>
                  </form>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      </div>
    );
};

export default ContestPrizeManager;