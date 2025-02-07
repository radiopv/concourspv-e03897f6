import React from 'react';
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Star, Award } from "lucide-react";

interface Member {
  first_name: string;
  last_name: string;
}

interface UserPoints {
  total_points: number;
  best_streak: number;
  current_rank: string;
  members: Member;
}

interface StreakStats {
  best_streak: number;
  members: Member;
}

const Campeones = () => {
  const { data: topPlayers } = useQuery<UserPoints[]>({
    queryKey: ['top-players'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_points')
        .select(`
          total_points,
          best_streak,
          current_rank,
          members (
            first_name,
            last_name
          )
        `)
        .order('total_points', { ascending: false })
        .limit(25);

      if (error) throw error;
      
      // Transform the data to match our interface
      return (data || []).map(item => ({
        total_points: item.total_points,
        best_streak: item.best_streak,
        current_rank: item.current_rank,
        members: item.members as Member
      }));
    }
  });

  const { data: streakStats } = useQuery<StreakStats[]>({
    queryKey: ['streak-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_points')
        .select(`
          best_streak,
          members (
            first_name,
            last_name
          )
        `)
        .order('best_streak', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      // Transform the data to match our interface
      return (data || []).map(item => ({
        best_streak: item.best_streak,
        members: item.members as Member
      }));
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-8 px-4 md:py-12">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent mb-4">
            Los Campeones 🏆
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Les légendes de Passion Varadero qui brillent par leur excellence !
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Top 25 Players */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Trophy className="h-6 w-6 text-amber-500" />
                Top 25 des Joueurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPlayers?.map((player, index) => (
                  <div
                    key={index}
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
                        {index + 1}
                      </div>
                      <div>
                        <span className="font-medium">
                          {player.members.first_name} {player.members.last_name}
                        </span>
                        <div className="text-sm text-gray-500">
                          {player.current_rank}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-indigo-600">
                        {player.total_points} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Best Streaks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-6 w-6 text-amber-500" />
                Meilleures Séries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {streakStats?.map((player, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Medal className="h-5 w-5 text-amber-500" />
                      <span>{player.members.first_name} {player.members.last_name}</span>
                    </div>
                    <span className="font-bold text-amber-600">
                      {player.best_streak} réponses
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rank Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-amber-500" />
                Distribution des Rangs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['ELDORADO', 'CARNIVAL', 'RIO', 'SANTIAGO', 'HAVANA', 'NOVATO'].map((rank) => {
                  const count = topPlayers?.filter(p => p.current_rank === rank).length || 0;
                  return (
                    <div key={rank} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                      <span className="font-medium">{rank}</span>
                      <span className="text-gray-600">{count} joueurs</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Campeones;