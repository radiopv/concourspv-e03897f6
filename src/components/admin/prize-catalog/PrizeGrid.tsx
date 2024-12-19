import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Link as LinkIcon } from 'lucide-react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface PrizeGridProps {
  prizes: any[];
}

export const PrizeGrid = ({ prizes }: PrizeGridProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deletePrize = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('prize_catalog')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prize-catalog'] });
      toast({
        title: "Succès",
        description: "Le prix a été supprimé du catalogue",
      });
    },
    meta: {
      onError: (error: Error) => {
        console.error("Delete prize error:", error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le prix",
          variant: "destructive",
        });
      }
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {prizes.map((prize) => (
        <Card key={prize.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            {prize.image_url && (
              <div className="aspect-square relative mb-4">
                <img
                  src={prize.image_url}
                  alt={prize.name}
                  className="object-cover rounded-lg w-full h-full"
                />
                <div className="absolute top-2 right-2 space-x-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => {
                      toast({
                        title: "Info",
                        description: "La modification sera disponible prochainement",
                      });
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deletePrize.mutate(prize.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            <h3 className="font-semibold mb-2">{prize.name}</h3>
            {prize.description && (
              <p className="text-sm text-gray-500 mb-2">{prize.description}</p>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                {prize.value ? `${prize.value}€` : 'Prix non défini'}
              </span>
              {prize.shop_url && (
                <a
                  href={prize.shop_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <LinkIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};