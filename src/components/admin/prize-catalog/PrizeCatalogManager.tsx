import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../App";
import { useToast } from "@/hooks/use-toast";
import { PrizeFormDialog } from "./PrizeFormDialog";
import { PrizeGrid } from "./PrizeGrid";

interface PrizeFormData {
  name: string;
  description?: string;
  value?: number;
  image_url?: string;
  shop_url?: string;
}

const PrizeCatalogManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [editingPrize, setEditingPrize] = useState<any>(null);

  const { data: prizes, isLoading } = useQuery({
    queryKey: ["prize-catalog"],
    queryFn: async () => {
      console.log("Fetching prize catalog...");
      const { data, error } = await supabase
        .from("prize_catalog")
        .select("*")
        .order("name");

      if (error) throw error;
      console.log("Prize catalog data:", data);
      return data;
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("prizes")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("prizes")
        .getPublicUrl(filePath);

      if (editingPrize) {
        setEditingPrize({ ...editingPrize, image_url: publicUrl });
      }

      toast({
        title: "Succès",
        description: "L'image a été téléchargée",
      });
      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
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
    mutationFn: async (data: PrizeFormData) => {
      const { error } = await supabase.from("prize_catalog").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prize-catalog"] });
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
    },
  });

  const updatePrizeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PrizeFormData }) => {
      const { error } = await supabase
        .from("prize_catalog")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prize-catalog"] });
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
    },
  });

  const deletePrizeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("prize_catalog")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prize-catalog"] });
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
    },
  });

  const handleSubmit = async (formData: PrizeFormData) => {
    if (editingPrize) {
      updatePrizeMutation.mutate({ id: editingPrize.id, data: formData });
    } else {
      addPrizeMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return <div>Chargement du catalogue...</div>;
  }

  return (
    <div className="space-y-6">
      <PrizeFormDialog
        onSubmit={handleSubmit}
        onImageUpload={handleImageUpload}
        initialData={editingPrize}
        uploading={uploading}
        isEditing={!!editingPrize}
      />
      <PrizeGrid
        prizes={prizes || []}
        onEdit={setEditingPrize}
        onDelete={(id) => deletePrizeMutation.mutate(id)}
      />
    </div>
  );
};

export default PrizeCatalogManager;