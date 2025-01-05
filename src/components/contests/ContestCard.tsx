import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../App";
import ContestStats from "./ContestStats";
import UserProgress from "./contest-card/UserProgress";
import ContestPrizes from "./contest-card/ContestPrizes";
import ParticipationStats from "./contest-card/ParticipationStats";
import ContestWinner from "./contest-card/ContestWinner";

interface Participant {
  id: string;
  first_name: string;
  last_name: string;
  score: number;
  status: string;
  updated_at: string;
}

interface ContestCardProps {
  contest: {
    id: string;
    title: string;
    description?: string;
    is_new: boolean;
    has_big_prizes: boolean;
    status: string;
    participants?: {
      count: number;
      data?: Participant[];
    };
  };
  onSelect: (id: string) => void;
  index: number;
}

const ContestCard = ({ contest, onSelect, index }: ContestCardProps) => {
  // Find winner if contest has one
  const winner = contest.participants?.data?.find(p => p.status === 'WINNER');

  const { data: prizes } = useQuery({
    queryKey: ['contest-prizes', contest.id],
    queryFn: async () => {
      const { data: prizesData } = await supabase
        .from('prizes')
        .select(`
          catalog_item_id,
          prize_catalog (
            name,
            image_url,
            shop_url
          )
        `)
        .eq('contest_id', contest.id);
      return prizesData || [];
    },
  });

  const { data: userParticipation } = useQuery({
    queryKey: ['user-participation', contest.id],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return null;

      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('contest_id', contest.id)
        .eq('id', session.user.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  });

  const remainingAttempts = 3; // Example value, replace with actual logic

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow glass-card float">
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-xl font-bold">{contest.title}</CardTitle>
            {contest.is_new && (
              <Badge variant="secondary" className="bg-blue-500 text-white">
                Nouveau
              </Badge>
            )}
          </div>
          {contest.has_big_prizes && (
            <Badge variant="secondary" className="bg-amber-500 text-white flex items-center gap-1 w-fit">
              <Trophy className="w-4 h-4" />
              Gros lots à gagner
            </Badge>
          )}
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {contest.description && (
            <p className="text-gray-600 mb-6">
              {contest.description}
            </p>
          )}
          
          <ContestStats contestId={contest.id} />

          {winner && <ContestWinner winner={winner} />}

          <UserProgress
            userParticipation={userParticipation}
            settings={{}} // Replace with actual settings
            remainingAttempts={remainingAttempts}
          />
          
          <ContestPrizes prizes={prizes || []} />

          <div className="mt-4 space-y-4">
            <ParticipationStats
              participantsCount={contest.participants?.count || 0}
            />

            <Button 
              onClick={() => onSelect(contest.id)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3"
              disabled={remainingAttempts <= 0}
            >
              {remainingAttempts > 0 ? 'Participer' : 'Plus de tentatives disponibles'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContestCard;