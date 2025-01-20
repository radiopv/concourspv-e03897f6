import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContestPrizeManagerProps {
  contestId: string;
}

const ContestPrizeManager = ({ contestId }: ContestPrizeManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query to fetch prizes with catalog information
  const { data: contestPrizes, isLoading } = useQuery({
    queryKey: ['prizes', contestId],
    queryFn: async () => {
      console.log('Fetching contest prizes...');
      const { data, error } = await supabase
        .from('prizes')
        .select(`
          *,
          prize_catalog (
            id,
            name,
            description,
            value,
            image_url,
            shop_url
          )
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

  // Query to fetch available prizes from catalog
  const { data: catalogPrizes } = useQuery({
    queryKey: ['prize-catalog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prize_catalog')
        .select('*')
        .eq('is_visible', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const addPrizeMutation = useMutation({
    mutationFn: async (catalogItemId: string) => {
      console.log('Adding prize to contest:', { contestId, catalogItemId });
      
      // Check if we already have 2 prizes
      if (contestPrizes && contestPrizes.length >= 2) {
        throw new Error("Maximum 2 prizes allowed per contest");
      }

      const { error } = await supabase
        .from('prizes')
        .insert([{
          contest_id: contestId,
          prize_catalog_id: catalogItemId,
          is_choice: contestPrizes && contestPrizes.length === 1 // Second prize is automatically marked as choice
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prizes', contestId] });
      setIsDialogOpen(false);
      toast({
        title: "Succès",
        description: "Le prix a été ajouté au concours",
      });
    },
    onError: (error) => {
      console.error("Add prize error:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible d'ajouter le prix",
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
      {(!contestPrizes || contestPrizes.length < 2) && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              Ajouter un prix du catalogue
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Catalogue des prix</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[500px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {catalogPrizes?.map((prize) => (
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
                          {prize.value ? `$${prize.value}` : 'Prix non défini'}
                        </span>
                        <Button
                          onClick={() => addPrizeMutation.mutate(prize.id)}
                          size="sm"
                        >
                          Sélectionner
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contestPrizes?.map((prize, index) => (
          <Card key={prize.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              {prize.prize_catalog?.image_url && (
                <div className="aspect-square relative mb-4">
                  <img
                    src={prize.prize_catalog.image_url}
                    alt={prize.prize_catalog.name}
                    className="object-cover rounded-lg w-full h-full"
                  />
                </div>
              )}
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{prize.prize_catalog?.name}</h3>
                {index === 1 && (
                  <Badge variant="secondary" className="ml-2">
                    Prix au choix
                  </Badge>
                )}
              </div>
              {prize.prize_catalog?.description && (
                <p className="text-sm text-gray-500 mb-2">{prize.prize_catalog.description}</p>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {prize.prize_catalog?.value ? `$${prize.prize_catalog.value}` : 'Prix non défini'}
                </span>
                {prize.prize_catalog?.shop_url && (
                  <a
                    href={prize.prize_catalog.shop_url}
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