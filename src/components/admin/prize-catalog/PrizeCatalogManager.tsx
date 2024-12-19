import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PrizeGrid } from "./PrizeGrid";
import { AddPrizeDialog } from "./AddPrizeDialog";
import { usePrizeMutations } from "@/hooks/usePrizeMutations";

export const PrizeCatalogManager = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

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
      if (!file) return null;

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

      toast({
        title: "Succès",
        description: "L'image a été téléchargée",
      });

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

  const { addPrizeToCatalog, updatePrize, deletePrize } = usePrizeMutations();

  const handleSave = async (formData: any) => {
    if (formData.id) {
      updatePrize.mutate({ prizeId: formData.id, data: formData });
    } else {
      addPrizeToCatalog.mutate(formData);
    }
  };

  if (isLoading) {
    return <div className="p-6">Chargement du catalogue...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold mb-6">Catalogue des Prix</h1>
      <AddPrizeDialog
        onSave={handleSave}
        onImageUpload={handleImageUpload}
        uploading={uploading}
      />
      <PrizeGrid
        prizes={prizes || []}
        onEdit={(prize) => handleSave({ ...prize, id: prize.id })}
        onDelete={(id) => deletePrize.mutate(id)}
      />
    </div>
  );
};

export default PrizeCatalogManager;