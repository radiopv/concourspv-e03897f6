
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Trophy, Crown } from "lucide-react";

interface TopParticipant {
  id: string;
  score: number;
  first_name: string;
  last_name: string;
  current_rank: string;
}

const TopParticipantsList = () => {
  const { data: topParticipants, isLoading, error } = useQuery<TopParticipant[]>({
    queryKey: ['top-participants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participants')
        .select(`
          id,
          score,
          first_name,
          last_name,
          current_rank
        `)
        .order('score', { ascending: false })
        .limit(25);

      if (error) {
        console.error('Error fetching participants:', error);
        throw error;
      }
      
      return data || [];
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            Chargement du classement...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="h-16 bg-gray-100 animate-pulse rounded-lg"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    console.error('Error in TopParticipantsList:', error);
    return (
      <Card>
        <CardContent className="p-6 text-center text-red-500">
          Une erreur est survenue lors du chargement du classement.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" />
          Classement des joueurs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topParticipants?.map((participant, index) => (
            <div
              key={participant.id}
              className={`
                flex items-center justify-between p-4 rounded-lg
                ${index < 3 ? 'bg-gradient-to-r from-amber-50 to-amber-100' : 'bg-white'}
                shadow-sm hover:shadow-md transition-shadow duration-200
              `}
            >
              <div className="flex items-center gap-4">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-bold
                  ${index === 0 ? 'bg-yellow-500 text-white' : 
                    index === 1 ? 'bg-gray-300 text-gray-800' :
                    index === 2 ? 'bg-amber-700 text-white' :
                    'bg-gray-100 text-gray-600'}
                `}>
                  {index === 0 ? <Crown className="h-5 w-5" /> : index + 1}
                </div>
                <div>
                  <span className="font-medium">
                    {participant.first_name} {participant.last_name}
                  </span>
                  <div className="text-sm text-gray-500">
                    {participant.current_rank}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-indigo-600">
                  {participant.score}%
                </span>
              </div>
            </div>
          ))}
          {(!topParticipants || topParticipants.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              Aucun participant pour le moment
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopParticipantsList;
