import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "../../App";
import { Image, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface ContestPrizeManagerProps {
  contestId: string;
}

const ContestPrizeManager = ({ contestId }: ContestPrizeManagerProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: prizes, isLoading } = useQuery({
    queryKey: ['prizes', contestId],
    queryFn: async () => {
      const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true";
      if (!isAuthenticated) {
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase
        .from('prizes')
        .select('*')
        .eq('contest_id', contestId);
      
      if (error) throw error;
      return data;
    }
  });

  const deletePrizeMutation = useMutation({
    mutationFn: async (prizeId: string) => {
      const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true";
      if (!isAuthenticated) {
        throw new Error("Not authenticated");
      }

      const prize = prizes?.find(p => p.id === prizeId);
      if (prize?.image_url) {
        await supabase.storage
          .from('prizes')
          .remove([prize.image_url.split('/').pop() || '']);
      }

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
        description: "Le prix a été supprimé",
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true";
      if (!isAuthenticated) {
        toast({
          title: "Erreur",
          description: "Vous devez être authentifié",
          variant: "destructive",
        });
        return;
      }

      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('prizes')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('prizes')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('prizes')
        .insert([
          {
            contest_id: contestId,
            image_url: publicUrl,
            name: file.name
          }
        ]);

      if (dbError) {
        console.error("Database error:", dbError);
        throw dbError;
      }

      queryClient.invalidateQueries({ queryKey: ['prizes', contestId] });
      toast({
        title: "Succès",
        description: "L'image du prix a été ajoutée",
      });
    } catch (error) {
      console.error("Image upload error:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'image",
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
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un prix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="image">Image du prix</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prizes?.map((prize) => (
          <Card key={prize.id}>
            <CardContent className="pt-6">
              <div className="aspect-square relative mb-4">
                <img
                  src={prize.image_url}
                  alt={prize.name}
                  className="object-cover rounded-lg w-full h-full"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => deletePrizeMutation.mutate(prize.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-center text-gray-500">{prize.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContestPrizeManager;