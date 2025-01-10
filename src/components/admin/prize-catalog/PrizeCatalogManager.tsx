import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { motion } from "framer-motion";

const PrizeCatalogManager = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    value: '',
    image_url: '',
    shop_url: '',
  });

  const { data: catalogPrizes, isLoading } = useQuery({
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
        .insert([{
          name: data.name,
          description: data.description,
          value: parseFloat(data.value) || null,
          image_url: data.image_url,
          shop_url: data.shop_url,
          is_active: true
        }]);
      
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

  if (isLoading) {
    return <div>Chargement du catalogue...</div>;
  }

  return (
    <div className="space-y-6">
      <Collapsible open={isFormOpen} onOpenChange={setIsFormOpen}>
        <CollapsibleTrigger asChild>
          <Button className="w-full bg-gradient-to-r from-amber-500 to-purple-500 text-white hover:from-amber-600 hover:to-purple-600">
            {isFormOpen ? (
              <X className="w-4 h-4 mr-2" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            {isFormOpen ? "Fermer le formulaire" : "Ajouter un prix au catalogue"}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <Card className="bg-gradient-to-br from-purple-50 to-amber-50">
            <CardContent className="pt-6">
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                addPrizeMutation.mutate(formData);
              }}>
                <div>
                  <Label htmlFor="name">Nom du prix</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-white/50"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-white/50"
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
                    className="bg-white/50"
                  />
                </div>

                <div>
                  <Label htmlFor="shop_url">Lien vers la boutique</Label>
                  <Input
                    id="shop_url"
                    type="url"
                    value={formData.shop_url}
                    onChange={(e) => setFormData({ ...formData, shop_url: e.target.value })}
                    className="bg-white/50"
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
                    className="bg-white/50"
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
                  className="w-full bg-gradient-to-r from-amber-500 to-purple-500 text-white hover:from-amber-600 hover:to-purple-600"
                  disabled={uploading}
                >
                  Ajouter au catalogue
                </Button>
              </form>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalogPrizes?.map((prize) => (
          <motion.div
            key={prize.id}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="overflow-hidden bg-gradient-to-br from-purple-50 to-amber-50 hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                {prize.image_url && (
                  <div className="aspect-video">
                    <img
                      src={prize.image_url}
                      alt={prize.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{prize.name}</h3>
                  {prize.description && (
                    <p className="text-sm text-gray-600 mb-2">{prize.description}</p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-purple-600">
                      {prize.value ? `${prize.value} $` : 'Prix non défini'}
                    </span>
                    {prize.shop_url && (
                      <a
                        href={prize.shop_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  <div className="mt-4 space-y-2">
                    <Button
                      variant="outline"
                      className="w-full text-purple-600 border-purple-600 hover:bg-purple-50"
                      onClick={() => {
                        // Logique pour ajouter à un concours
                        toast({
                          title: "Info",
                          description: "Fonctionnalité à venir : Ajouter à un concours",
                        });
                      }}
                    >
                      Ajouter à un concours
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => deletePrizeMutation.mutate(prize.id)}
                    >
                      Supprimer du catalogue
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PrizeCatalogManager;