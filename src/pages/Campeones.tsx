
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageMetadata from '@/components/seo/PageMetadata';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Trophy, Crown, Medal } from 'lucide-react';

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
  total_points?: number;
  wins_count?: number;
}

const Campeones = () => {
  const { data: winners = [], isLoading } = useQuery<Winner[]>({
    queryKey: ['winners'],
    queryFn: async () => {
      const { data: participantPrizes, error } = await supabase
        .from('participant_prizes')
        .select(`
          id,
          participant:participants!inner(
            id,
            first_name,
            last_name
          ),
          contest:contests!inner(
            id,
            title
          ),
          prize:prizes!inner(
            id,
            prize_catalog!inner(
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

      console.log('Winners data:', participantPrizes);
      
      return (participantPrizes || []).map((winner): Winner => {
        if (!winner || !winner.participant || !winner.contest || !winner.prize) {
          throw new Error('Invalid winner data structure');
        }

        const participant = Array.isArray(winner.participant) 
          ? winner.participant[0] 
          : winner.participant;

        const contest = Array.isArray(winner.contest)
          ? winner.contest[0]
          : winner.contest;

        const prize = Array.isArray(winner.prize)
          ? winner.prize[0]
          : winner.prize;

        if (!participant || !contest || !prize?.prize_catalog) {
          throw new Error('Missing required winner data');
        }

        return {
          id: winner.id,
          participant: {
            id: participant.id,
            first_name: participant.first_name,
            last_name: participant.last_name
          },
          contest: {
            id: contest.id,
            title: contest.title
          },
          prize: {
            id: prize.id,
            name: prize.prize_catalog.name || 'Prix non spécifié',
            description: prize.prize_catalog.description || null,
            image_url: prize.prize_catalog.image_url || null
          }
        };
      });
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
          {winners.map((winner, index) => (
            <Card key={winner.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`relative ${winner.prize?.image_url ? 'h-48' : 'h-24'} w-full bg-gradient-to-r from-amber-100 to-amber-200`}>
                {winner.prize?.image_url ? (
                  <img
                    src={winner.prize.image_url}
                    alt={winner.prize.name || 'Prix'}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {index === 0 ? (
                      <Crown className="h-12 w-12 text-amber-500" />
                    ) : index === 1 ? (
                      <Medal className="h-12 w-12 text-gray-400" />
                    ) : index === 2 ? (
                      <Medal className="h-12 w-12 text-amber-700" />
                    ) : (
                      <Trophy className="h-12 w-12 text-amber-300" />
                    )}
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {winner.participant?.first_name} {winner.participant?.last_name}
                  {index < 3 && (
                    <span className="text-sm px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                      #{index + 1}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  A gagné {winner.prize?.name} dans le concours "{winner.contest?.title}"
                </p>
                {winner.prize?.description && (
                  <p className="mt-2 text-sm text-gray-500">
                    {winner.prize.description}
                  </p>
                )}
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
