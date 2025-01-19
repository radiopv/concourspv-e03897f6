import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import PrizeCatalogDialog from './prize/PrizeCatalogDialog';
import { ContestPrize, Prize } from '@/types/prize';

interface ContestPrizeManagerProps {
  contestId: string;
}

const ContestPrizeManager = ({ contestId }: ContestPrizeManagerProps) => {
  const [showPrizeCatalog, setShowPrizeCatalog] = React.useState(false);

  const { data: prizes } = useQuery({
    queryKey: ['contest-prizes', contestId],
    queryFn: async () => {
      console.log('Fetching contest prizes...');
      const { data, error } = await supabase
        .from('prizes')
        .select(`
          id,
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

      if (error) throw error;
      console.log('Contest prizes data:', data);
      return (data as any[]).map(prize => ({
        id: prize.id,
        prize_catalog: prize.prize_catalog as Prize
      })) as ContestPrize[];
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {prizes?.map((prize) => (
            <Card key={prize.id} className="flex flex-col">
              <CardContent className="p-4">
                {prize.prize_catalog && (
                  <div className="space-y-2">
                    <div className="aspect-w-16 aspect-h-9 relative">
                      {prize.prize_catalog.image_url && (
                        <img
                          src={prize.prize_catalog.image_url}
                          alt={prize.prize_catalog.name}
                          className="object-cover rounded-lg w-full h-48"
                        />
                      )}
                    </div>
                    <h3 className="font-semibold text-lg">{prize.prize_catalog.name}</h3>
                    {prize.prize_catalog.description && (
                      <p className="text-sm text-gray-600">{prize.prize_catalog.description}</p>
                    )}
                    {prize.prize_catalog.value && (
                      <p className="text-sm font-medium">Valeur : {prize.prize_catalog.value} €</p>
                    )}
                    {prize.prize_catalog.shop_url && (
                      <a
                        href={prize.prize_catalog.shop_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Voir le produit
                      </a>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {(!prizes || prizes.length < 2) && (
            <Button
              variant="outline"
              className="h-48 w-full flex flex-col items-center justify-center gap-2"
              onClick={() => setShowPrizeCatalog(true)}
            >
              <Plus className="h-6 w-6" />
              <span>Ajouter un prix</span>
            </Button>
          )}
        </div>
      </div>

      <PrizeCatalogDialog
        open={showPrizeCatalog}
        onOpenChange={setShowPrizeCatalog}
        contestId={contestId}
      />
    </div>
  );
};

export default ContestPrizeManager;