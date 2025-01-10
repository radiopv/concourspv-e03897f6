import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ParticipantInfoProps {
  userId: string;
  contestId: string;
}

const ParticipantInfo = ({ userId, contestId }: ParticipantInfoProps) => {
  const { toast } = useToast();

  const { data: participants, isLoading, error } = useQuery({
    queryKey: ['participant-info', userId, contestId],
    queryFn: async () => {
      console.log('Fetching participant info for:', { userId, contestId });
      
      const { data, error } = await supabase
        .from('participants')
        .select('participation_id, attempts')
        .eq('id', userId)
        .eq('contest_id', contestId);

      if (error) {
        console.error('Error fetching participant info:', error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les informations du participant",
          variant: "destructive",
        });
        throw error;
      }

      console.log('Participant data:', data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6">
          <p className="text-red-500">Une erreur est survenue lors de la récupération des données</p>
        </CardContent>
      </Card>
    );
  }

  if (!participants || participants.length === 0) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <p className="text-gray-500">Aucun participant trouvé</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations du participant</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {participants.map((participant) => (
            <div key={participant.participation_id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">ID de participation:</span>
                <span className="text-gray-600">{participant.participation_id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Nombre de tentatives:</span>
                <span className="text-gray-600">{participant.attempts}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ParticipantInfo;