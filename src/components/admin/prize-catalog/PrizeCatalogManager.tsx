import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PrizeGrid } from "./PrizeGrid";
import { AddPrizeDialog } from "./AddPrizeDialog";

export const PrizeCatalogManager = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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

  if (isLoading) {
    return <div className="p-6">Chargement du catalogue...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Catalogue des Prix</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un prix
        </Button>
      </div>

      <AddPrizeDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onImageUpload={handleImageUpload}
        uploading={uploading}
      />

      <PrizeGrid prizes={prizes || []} />
    </div>
  );
};

export default PrizeCatalogManager;