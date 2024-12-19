import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PrizeList } from "./prize/PrizeList";
import { PrizeCatalogDialog } from "./prize/PrizeCatalogDialog";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

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
      <PrizeCatalogDialog onSelectPrize={(id) => addPrizeMutation.mutate(id)} />
      
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
                <p className="text-sm text-gray-500 mb-2">{prize.catalog_item.description}</p>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {prize.catalog_item?.value ? `${prize.catalog_item.value}€` : 'Prix non défini'}
                </span>
                <button
                  onClick={() => deletePrizeMutation.mutate(prize.id)}
                  className="mt-4 w-full px-4 py-2 text-sm text-red-600 hover:text-red-800 border border-red-600 hover:border-red-800 rounded-md transition-colors"
                >
                  Retirer ce prix
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContestPrizeManager;
