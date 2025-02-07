
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageMetadata from '@/components/seo/PageMetadata';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Trophy } from 'lucide-react';

type Winner = {
  id: string;
  participant: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
  contest: {
    id: string;
    title: string;
  } | null;
  prize: {
    id: string;
    name: string;
    description: string | null;
    image_url: string | null;
  } | null;
}

const Campeones = () => {
  const { data: winners = [], isLoading } = useQuery<Winner[]>({
    queryKey: ['winners'],
    queryFn: async () => {
      console.log('Fetching winners...');
      const { data, error } = await supabase
        .from('participant_prizes')
        .select(`
          id,
          participant:participant_id(id, first_name, last_name),
          contest:contest_id(id, title),
          prize:prize_id(
            id,
            prize_catalog:prize_catalog_id(
              name,
              description,
              image_url
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching winners:', error);
        throw error;
      }

      console.log('Winners data:', data);
      
      return (data || []).map((winner): Winner => ({
        id: winner.id,
        participant: winner.participant || null,
        contest: winner.contest || null,
        prize: winner.prize ? {
          id: winner.prize.id,
          name: winner.prize.prize_catalog?.name || 'Prix non spécifié',
          description: winner.prize.prize_catalog?.description || null,
          image_url: winner.prize.prize_catalog?.image_url || null
        } : null
      }));
    }
  });

  return (
    <div className="space-y-6">
      <PageMetadata 
        title="Los Campeones | Passion Varadero" 
        description="Découvrez les gagnants de nos concours Passion Varadero" 
        pageUrl={window.location.href}
      />
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Trophy className="h-8 w-8 text-amber-500" />
          Los Campeones
        </h1>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="animate-pulse">
              <CardHeader className="h-32 bg-gray-200" />
              <CardContent className="space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : winners && winners.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {winners.map((winner) => (
            <Card key={winner.id} className="overflow-hidden">
              {winner.prize?.image_url && (
                <div className="relative h-48 w-full">
                  <img
                    src={winner.prize.image_url}
                    alt={winner.prize.name || 'Prize image'}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg">
                  {winner.participant?.first_name} {winner.participant?.last_name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  A gagné {winner.prize?.name} dans le concours "{winner.contest?.title}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <Trophy className="h-12 w-12 text-amber-500 mb-4" />
            <h3 className="text-lg font-semibold">Pas encore de gagnants</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Participez à nos concours pour avoir une chance de gagner !
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Campeones;
