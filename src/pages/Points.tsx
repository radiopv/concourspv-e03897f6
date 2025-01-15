import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import CommunityStats from "@/components/points/CommunityStats";
import RanksList from "@/components/points/RanksList";
import ExtraParticipations from "@/components/points/ExtraParticipations";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const Points = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['community-stats'],
    queryFn: async () => {
      const { data: { count: totalParticipants }, error: participantsError } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true });

      const { data: { count: totalContests }, error: contestsError } = await supabase
        .from('contests')
        .select('*', { count: 'exact', head: true });

      const { data: topScoreData, error: topScoreError } = await supabase
        .from('participants')
        .select('score')
        .order('score', { ascending: false })
        .limit(1)
        .single();

      if (participantsError || contestsError || topScoreError) {
        throw new Error('Failed to fetch community stats');
      }

      return {
        totalParticipants: totalParticipants || 0,
        totalContests: totalContests || 0,
        topScore: topScoreData?.score || 0
      };
    }
  });

  return (
    <div className="space-y-8">
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <Trophy className="w-8 h-8 mx-auto text-amber-500 mb-2" />
          <CardTitle className="text-2xl font-bold text-amber-800">
            Système de Points et Récompenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isLoading && stats && <CommunityStats {...stats} />}
          <RanksList />
          <ExtraParticipations />
        </CardContent>
      </Card>
    </div>
  );
};

export default Points;