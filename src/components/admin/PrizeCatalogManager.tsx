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

interface ContestPrizeManagerProps {
  contestId: string;
}

const ContestPrizeManager = ({ contestId }: ContestPrizeManagerProps) => {
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

  // Query to fetch prizes with catalog information
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

  if (isLoading) {
    return <div>Chargement des prix...</div>;
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
                  <Label htmlFor="value">Valeur ($)</Label>
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
                    addPrizeMutation.mutate(formData.name);
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
                </div>
              )}
              <h3 className="font-semibold mb-2">{prize.catalog_item?.name}</h3>
              {prize.catalog_item?.description && (
                <div 
                  className="text-sm text-gray-500 mb-2"
                  dangerouslySetInnerHTML={{ __html: prize.catalog_item.description }}
                />
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {prize.catalog_item?.value ? `$${prize.catalog_item.value}` : 'Prix non défini'}
                </span>
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
