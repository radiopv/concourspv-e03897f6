
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageMetadata from '@/components/seo/PageMetadata';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Trophy } from 'lucide-react';

type Winner = {
  id: string;
  member: {
    id: string;
    full_name: string;
  } | null;
  contest: {
    id: string;
    name: string;
  } | null;
  prize: {
    id: string;
    name: string;
    description: string | null;
    image_url: string | null;
  } | null;
}

const Campeones = () => {
  const { data: winners, isLoading } = useQuery<Winner[]>({
    queryKey: ['winners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participant_prizes')
        .select(`
          id,
          member:member_id(id, full_name),
          contest:contest_id(id, name),
          prize:prize_id(id, name, description, image_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
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
                  {winner.member?.full_name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  A gagné {winner.prize?.name} dans le concours "{winner.contest?.name}"
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
