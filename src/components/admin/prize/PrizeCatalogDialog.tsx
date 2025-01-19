import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

interface PrizeCatalogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contestId: string;
}

const PrizeCatalogDialog = ({ open, onOpenChange, contestId }: PrizeCatalogDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: catalogItems } = useQuery({
    queryKey: ['prize-catalog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prize_catalog')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const addPrizeMutation = useMutation({
    mutationFn: async (prizeId: string) => {
      const { error } = await supabase
        .from('prizes')
        .insert([
          {
            contest_id: contestId,
            prize_catalog_id: prizeId,
          },
        ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contest-prizes', contestId] });
      toast({
        title: 'Prix ajouté',
        description: 'Le prix a été ajouté au concours avec succès.',
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: "Impossible d'ajouter le prix au concours.",
        variant: 'destructive',
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sélectionner un prix</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {catalogItems?.map((item) => (
            <Card key={item.id} className="flex flex-col">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="aspect-w-16 aspect-h-9 relative">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="object-cover rounded-lg w-full h-32"
                      />
                    )}
                  </div>
                  <h3 className="font-semibold">{item.name}</h3>
                  {item.description && (
                    <p className="text-sm text-gray-600">{item.description}</p>
                  )}
                  {item.value && (
                    <p className="text-sm font-medium">Valeur : {item.value} €</p>
                  )}
                  <Button
                    className="w-full mt-2"
                    onClick={() => addPrizeMutation.mutate(item.id)}
                  >
                    Sélectionner
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrizeCatalogDialog;