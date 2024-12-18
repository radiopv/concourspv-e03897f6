import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Star, Medal } from "lucide-react";
import { supabase } from "../App";
import ContestStats from '@/components/contest/ContestStats';

interface LocationState {
  finalScore?: number;
}

const ContestStatsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const state = location.state as LocationState;

  const { data: contest } = useQuery({
    queryKey: ['contest', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          participants (count)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const { data: topParticipants } = useQuery({
    queryKey: ['top-participants', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participants')
        .select(`
          id,
          score,
          profiles:id (
            full_name,
            avatar_url
          )
        `)
        .eq('contest_id', id)
        .order('score', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    }
  });

  const { data: stats } = useQuery({
    queryKey: ['contest-stats', id],
    queryFn: async () => {
      const { data: qualifiedParticipants, error: qualifiedError } = await supabase
        .from('participants')
        .select('id')
        .eq('contest_id', id)
        .gte('score', 70);

      if (qualifiedError) throw qualifiedError;

      const { data: avgScore, error: avgError } = await supabase
        .from('participants')
        .select('score')
        .eq('contest_id', id);

      if (avgError) throw avgError;

      const average = avgScore.reduce((acc, curr) => acc + (curr.score || 0), 0) / avgScore.length;

      return {
        qualifiedCount: qualifiedParticipants.length,
        averageScore: Math.round(average)
      };
    }
  });

  if (!contest || !stats) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {state?.finalScore && (
            <Card className="bg-gradient-to-r from-amber-100 to-amber-200 border-none">
              <CardContent className="p-6 text-center">
                <Trophy className="w-16 h-16 text-amber-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-amber-900 mb-2">
                  Félicitations !
                </h2>
                <p className="text-amber-800">
                  Votre score final est de {state.finalScore}% !
                  {state.finalScore >= 70 && (
                    <span className="block mt-2 font-medium">
                      Vous êtes éligible pour le tirage au sort ! 🎉
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>
          )}

          <ContestStats
            participantsCount={contest.participants_count || 0}
            successPercentage={Math.round((stats.qualifiedCount / (contest.participants_count || 1)) * 100)}
            timeLeft=""
            endDate={contest.end_date}
          />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Medal className="w-6 h-6 text-amber-500" />
                Top 10 des participants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topParticipants?.map((participant, index) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center font-bold
                        ${index === 0 ? 'bg-amber-500 text-white' : 
                          index === 1 ? 'bg-gray-300 text-gray-800' :
                          index === 2 ? 'bg-amber-700 text-white' :
                          'bg-gray-100 text-gray-600'}
                      `}>
                        {index + 1}
                      </div>
                      <span className="font-medium">
                        {participant.profiles?.full_name || 'Participant anonyme'}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-indigo-600">
                      {participant.score}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500" />
                  Score moyen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center text-yellow-600">
                  {stats.averageScore}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-green-500" />
                  Participants qualifiés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center text-green-600">
                  {stats.qualifiedCount} / {contest.participants_count || 0}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestStatsPage;