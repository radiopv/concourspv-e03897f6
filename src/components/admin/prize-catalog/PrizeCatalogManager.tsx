import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../App";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PrizeForm } from "./components/PrizeForm";
import { PrizeCard } from "./components/PrizeCard";
import { Prize, PrizeFormData } from "./types";

const PrizeCatalogManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      return data as Prize[];
    },
  });

  const addPrizeMutation = useMutation({
    mutationFn: async (data: PrizeFormData) => {
      const { error } = await supabase.from("prize_catalog").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prize-catalog"] });
      setIsDialogOpen(false);
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
      setIsDialogOpen(false);
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un prix au catalogue
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPrize ? "Modifier le prix" : "Ajouter un prix au catalogue"}
            </DialogTitle>
          </DialogHeader>
          <PrizeForm
            initialData={editingPrize || undefined}
            onSubmit={handleSubmit}
            isEditing={!!editingPrize}
          />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prizes?.map((prize) => (
          <PrizeCard
            key={prize.id}
            prize={prize}
            onEdit={(prize) => {
              setEditingPrize(prize);
              setIsDialogOpen(true);
            }}
            onDelete={(id) => deletePrizeMutation.mutate(id)}
          />
        ))}
      </div>
    </div>
  );
};

export default PrizeCatalogManager;