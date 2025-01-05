import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../App";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PrizeForm } from "./PrizeForm";
import { PrizeCard } from "./PrizeCard";
import { usePrizeMutations } from "@/hooks/usePrizeMutations";

export const PrizeCatalogManager = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
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
      console.log("Fetching prize catalog...");
      const { data, error } = await supabase
        .from('prize_catalog')
        .select('*')
        .order('name');
      
      if (error) {
        console.error("Error fetching prize catalog:", error);
        throw error;
      }
      console.log("Prize catalog data:", data);
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

  const { addPrizeToCatalog, updatePrize, deletePrize } = usePrizeMutations();

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

  const handleSave = () => {
    const data = {
      name: formData.name,
      description: formData.description,
      value: formData.value ? parseFloat(formData.value) : null,
      image_url: formData.image_url,
      shop_url: formData.shop_url,
    };

    if (editingPrize) {
      updatePrize.mutate({ prizeId: editingPrize, data });
      setEditingPrize(null);
    } else {
      addPrizeToCatalog.mutate(data);
    }

    setFormData({
      name: '',
      description: '',
      value: '',
      image_url: '',
      shop_url: '',
    });
  };

  if (isLoading) {
    return <div>Chargement du catalogue...</div>;
  }

  return (
    <div className="space-y-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un prix au catalogue
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPrize ? 'Modifier le prix' : 'Ajouter un prix au catalogue'}
            </DialogTitle>
          </DialogHeader>
          <PrizeForm
            formData={formData}
            onFormChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
            onImageUpload={handleImageUpload}
            onCancel={() => {
              setEditingPrize(null);
              setFormData({
                name: '',
                description: '',
                value: '',
                image_url: '',
                shop_url: '',
              });
            }}
            onSave={handleSave}
            uploading={uploading}
          />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prizes?.map((prize) => (
          <PrizeCard
            key={prize.id}
            prize={prize}
            onEdit={handleEdit}
            onDelete={(id) => deletePrize.mutate(id)}
          />
        ))}
      </div>
    </div>
  );
};

export default PrizeCatalogManager;