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
import { Prize } from "@/types/prize";

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

  // Query to fetch prize catalog
  const { data: prizeCatalog, isLoading } = useQuery({
    queryKey: ['prize-catalog'],
    queryFn: async () => {
      console.log('Fetching prize catalog...');
      const { data, error } = await supabase
        .from('prize_catalog')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching prize catalog:', error);
        throw error;
      }
      console.log('Prize catalog data:', data);
      return data as Prize[];
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
    mutationFn: async (data: Omit<Prize, 'id'>) => {
      const formattedData = {
        ...data,
        value: data.value ? Number(data.value) : null
      };
      
      const { error } = await supabase
        .from('prize_catalog')
        .insert([formattedData]);
      
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
    mutationFn: async ({ id, data }: { id: string; data: Partial<Prize> }) => {
      const formattedData = {
        ...data,
        value: data.value ? Number(data.value) : null
      };
      
      const { error } = await supabase
        .from('prize_catalog')
        .update(formattedData)
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
              <form className="space-y-4">
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
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="shop_url">Lien vers la boutique</Label>
                  <Input
                    id="shop_url"
                    type="url"
                    value={formData.shop_url}
                    onChange={(e) => setFormData({ ...formData, shop_url: e.target.value })}
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

                <Button 
                  type="submit" 
                  className="w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    if (editingPrize) {
                      updatePrizeMutation.mutate({
                        id: editingPrize,
                        data: formData
                      });
                    } else {
                      addPrizeMutation.mutate(formData);
                    }
                  }}
                  disabled={uploading}
                >
                  {editingPrize ? 'Mettre à jour' : 'Ajouter au catalogue'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prizeCatalog?.map((prize) => (
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
                {prize.shop_url && (
                  <a
                    href={prize.shop_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
              <div className="mt-4 space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setEditingPrize(prize.id);
                    setFormData({
                      name: prize.name,
                      description: prize.description || '',
                      value: prize.value?.toString() || '',
                      image_url: prize.image_url || '',
                      shop_url: prize.shop_url || '',
                    });
                    setIsFormOpen(true);
                  }}
                >
                  Modifier
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => deletePrizeMutation.mutate(prize.id)}
                >
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PrizeCatalogManager;
