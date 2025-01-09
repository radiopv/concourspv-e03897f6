import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface LocationState {
  contestTitle?: string;
}

interface Participant {
  id: string;
  first_name: string;
  last_name: string;
}

interface ContestData {
  id: string;
  title: string;
  end_date: string;
  participants_count: number;
}

interface ParticipationData {
  id: string;
  score: number | null;
  participant: Participant;
}

interface TopParticipant {
  id: string;
  score: number;
  first_name: string;
  last_name: string;
}

const ContestStats = () => {
  const { contestId } = useParams();
  const location = useLocation();
  const state = location.state as LocationState;

  const { data: contest } = useQuery<ContestData>({
    queryKey: ['contest', contestId],
    queryFn: async () => {
      if (!contestId) throw new Error('Contest ID is required');

      const { data, error } = await supabase
        .from('contests')
        .select(`
          id,
          title,
          end_date,
          participants:participations(count)
        `)
        .eq('id', contestId)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        title: data.title,
        end_date: data.end_date,
        participants_count: data.participants?.[0]?.count || 0
      };
    },
    enabled: !!contestId
  });

  const { data: topParticipants } = useQuery<TopParticipant[]>({
    queryKey: ['top-participants', contestId],
    queryFn: async () => {
      if (!contestId) throw new Error('Contest ID is required');

      const { data, error } = await supabase
        .from('participations')
        .select(`
          id,
          score,
          participant:participants!inner (
            id,
            first_name,
            last_name
          )
        `)
        .eq('contest_id', contestId)
        .order('score', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Ensure data is of the correct type and handle the mapping
      const participations = data as unknown as ParticipationData[];
      
      return participations.map(p => ({
        id: p.participant.id,
        score: p.score || 0,
        first_name: p.participant.first_name,
        last_name: p.participant.last_name
      }));
    },
    enabled: !!contestId
  });

  if (!contest) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{state?.contestTitle || contest.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Informations générales</h3>
              <p>Date de fin: {format(new Date(contest.end_date), 'dd MMMM yyyy', { locale: fr })}</p>
              <p>Nombre de participants: {contest.participants_count}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Top participants</h3>
              <div className="space-y-2">
                {topParticipants?.map((participant, index) => (
                  <div key={participant.id} className="flex justify-between items-center">
                    <span>{index + 1}. {participant.first_name} {participant.last_name}</span>
                    <span className="font-semibold">{participant.score} points</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContestStats;