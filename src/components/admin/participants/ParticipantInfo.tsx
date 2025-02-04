import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface ParticipantInfoProps {
  userId: string;
  contestId: string;
}

const ParticipantInfo = ({ userId, contestId }: ParticipantInfoProps) => {
  const { data: participant, isLoading, error } = useQuery({
    queryKey: ['participant', userId, contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('contest_id', contestId)
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching participant:', error);
        throw error;
      }

      return data;
    }
  });

  if (isLoading) {
    return <Skeleton className="h-4 w-[200px]" />;
  }

  if (error) {
    return null;
  }

  if (!participant) {
    return (
      <Badge variant="outline" className="text-sm">
        Pas encore participé
      </Badge>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <Badge 
        variant="secondary"
        className={`text-sm ${participant.score >= 80 ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}`}
      >
        Score: {participant.score}%
      </Badge>
      <Badge variant="outline" className="text-sm">
        {participant.status === 'completed' ? 'Terminé' : 'En cours'}
      </Badge>
    </div>
  );
};

export default ParticipantInfo;