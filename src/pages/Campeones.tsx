
import React from 'react';
import { Trophy } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import PageMetadata from '@/components/seo/PageMetadata';
import TopParticipantsList from '@/components/points/TopParticipantsList';
import GlobalStatsCards from '@/components/stats/GlobalStatsCards';
import RecentWinnersList from '@/components/winners/RecentWinnersList';

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
  const { data: winners = [], isLoading: winnersLoading } = useQuery<Winner[]>({
    queryKey: ['winners'],
    queryFn: async () => {
      const { data: participantPrizes, error } = await supabase
        .from('participant_prizes')
        .select(`
          id,
          participant:participants(
            id,
            first_name,
            last_name
          ),
          contest:contests(
            id,
            title
          ),
          prize:prizes(
            id,
            prize_catalog:prize_catalog(
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

      return (participantPrizes || []).map((winner): Winner => {
        if (!winner) {
          throw new Error('Invalid winner data structure');
        }

        const participant = winner.participant ? 
          Array.isArray(winner.participant) ? winner.participant[0] : winner.participant 
          : null;

        const contest = winner.contest ? 
          Array.isArray(winner.contest) ? winner.contest[0] : winner.contest 
          : null;

        const prizeData = winner.prize ? 
          Array.isArray(winner.prize) ? winner.prize[0] : winner.prize 
          : null;

        const prizeCatalog = prizeData?.prize_catalog ? 
          Array.isArray(prizeData.prize_catalog) ? prizeData.prize_catalog[0] : prizeData.prize_catalog 
          : null;

        if (!participant || !contest || !prizeCatalog) {
          console.warn('Missing required winner data:', winner);
          return {
            id: winner.id,
            participant: null,
            contest: null,
            prize: null
          };
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
            id: prizeData?.id || '',
            name: prizeCatalog.name || 'Prix non spécifié',
            description: prizeCatalog.description || null,
            image_url: prizeCatalog.image_url || null
          }
        };
      });
    }
  });

  const { data: globalStats, isLoading: statsLoading } = useQuery({
    queryKey: ['global-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_points')
        .select('total_points, best_streak, current_streak, current_rank')
        .order('total_points', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <PageMetadata 
        title="Los Campeones | Passion Varadero" 
        description="Découvrez les champions et les meilleurs joueurs de Passion Varadero" 
        pageUrl={window.location.href}
      />
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Trophy className="h-8 w-8 text-amber-500" />
          Los Campeones
        </h1>
      </div>

      {/* Statistiques globales */}
      <GlobalStatsCards globalStats={globalStats} />

      {/* Top 25 des joueurs */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Top 25 des Joueurs</h2>
        <TopParticipantsList />
      </div>

      {/* Section des gagnants récents */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Gagnants Récents</h2>
        <RecentWinnersList winners={winners} isLoading={winnersLoading} />
      </div>
    </div>
  );
};

export default Campeones;
