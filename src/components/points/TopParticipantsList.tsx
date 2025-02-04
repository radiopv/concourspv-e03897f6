import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Trophy, Medal, Crown } from "lucide-react";

const TopParticipantsList = () => {
  const { data: topParticipants, isLoading } = useQuery({
    queryKey: ['top-participants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_points')
        .select(`
          user_id,
          total_points,
          current_rank,
          members (
            first_name,
            last_name
          )
        `)
        .order('total_points', { ascending: false })
        .limit(25);

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Chargement du classement...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" />
          Top 25 des joueurs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topParticipants?.map((participant, index) => (
            <div
              key={participant.user_id}
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
                    {participant.members?.first_name} {participant.members?.last_name}
                  </span>
                  <div className="text-sm text-gray-500">
                    {participant.current_rank || 'NOVATO'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-indigo-600">
                  {participant.total_points} pts
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopParticipantsList;