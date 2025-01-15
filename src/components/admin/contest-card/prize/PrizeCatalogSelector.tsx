import React from 'react';
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Award } from 'lucide-react';

interface PrizeCatalogSelectorProps {
  onSelectPrize: (prizeId: string) => void;
}

const PrizeCatalogSelector = ({ onSelectPrize }: PrizeCatalogSelectorProps) => {
  const { data: catalogPrizes, isLoading } = useQuery({
    queryKey: ['prize-catalog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prize_catalog')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Chargement du catalogue...</div>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Award className="w-4 h-4 mr-2" />
          Sélectionner un prix du catalogue
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
                      onClick={() => onSelectPrize(prize.id)}
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
  );
};

export default PrizeCatalogSelector;