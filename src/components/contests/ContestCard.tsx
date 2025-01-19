import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Target, Star, Coins } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import ContestStats from "./ContestStats";
import UserProgress from "./contest-card/UserProgress";
import ContestPrizes from "./contest-card/ContestPrizes";
import ParticipationStats from "./contest-card/ParticipationStats";
import { calculateWinningChance } from "../../utils/contestCalculations";
import { Prize } from "@/types/prize";

interface ContestCardProps {
  contest: {
    id: string;
    title: string;
    description?: string;
    is_new: boolean;
    has_big_prizes: boolean;
    participants?: { count: number };
    prizes?: Prize[];
  };
  onSelect: (id: string) => void;
  index: number;
}

const ContestCard = ({ contest, onSelect, index }: ContestCardProps) => {
  // Fetch detailed stats for the contest
  const { data: stats } = useQuery({
    queryKey: ['contest-detailed-stats', contest.id],
    queryFn: async () => {
      const { data: participants } = await supabase
        .from('participants')
        .select('score, status')
        .eq('contest_id', contest.id)
        .not('score', 'is', null);

      if (!participants) return null;

      const qualifiedParticipants = participants.filter(p => p.score >= 90);
      const averageScore = participants.length > 0
        ? Math.round(participants.reduce((acc, p) => acc + (p.score || 0), 0) / participants.length)
        : 0;

      return {
        totalParticipants: participants.length,
        qualifiedParticipants: qualifiedParticipants.length,
        averageScore,
        winningChance: calculateWinningChance(qualifiedParticipants.length)
      };
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`w-full max-w-4xl mx-auto ${contest.participants?.count === 1 ? 'md:w-2/3 lg:w-1/2' : ''}`}
    >
      <Card className="bg-gradient-to-br from-[#1A1F2C] to-[#2D243B] text-white shadow-xl hover:shadow-2xl transition-all duration-300 border-[#9b87f5]/20">
        <CardHeader className="border-b border-[#9b87f5]/20 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#F97316] bg-clip-text text-transparent">
              {contest.title}
            </CardTitle>
            <div className="flex gap-2">
              {contest.is_new && (
                <Badge className="bg-[#F97316] text-white">
                  Nouveau
                </Badge>
              )}
              {contest.has_big_prizes && (
                <Badge className="bg-[#9b87f5] text-white">
                  Gros Lots
                </Badge>
              )}
            </div>
          </div>
          {contest.description && (
            <p className="text-gray-300 mt-2">{contest.description}</p>
          )}
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/30 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 text-[#9b87f5] mb-2">
                <Users className="w-4 h-4" />
                <h3 className="font-medium">Participants</h3>
              </div>
              <p className="text-2xl font-bold text-white">
                {stats?.totalParticipants || 0}
              </p>
            </div>

            <div className="bg-black/30 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 text-[#F97316] mb-2">
                <Star className="w-4 h-4" />
                <h3 className="font-medium">Score Moyen</h3>
              </div>
              <p className="text-2xl font-bold text-white">
                {stats?.averageScore || 0}%
              </p>
            </div>

            <div className="bg-black/30 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 text-[#9b87f5] mb-2">
                <Trophy className="w-4 h-4" />
                <h3 className="font-medium">Participants Éligibles</h3>
              </div>
              <p className="text-2xl font-bold text-white">
                {stats?.qualifiedParticipants || 0}
              </p>
            </div>

            <div className="bg-black/30 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 text-[#F97316] mb-2">
                <Coins className="w-4 h-4" />
                <h3 className="font-medium">Chances de Gagner</h3>
              </div>
              <p className="text-2xl font-bold text-white">
                {stats?.winningChance || 100}%
              </p>
            </div>
          </div>

          <ContestPrizes prizes={contest.prizes || []} />

          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => onSelect(contest.id)}
              className="bg-gradient-to-r from-[#9b87f5] to-[#F97316] hover:from-[#8B5CF6] hover:to-[#D946EF] text-white font-bold py-6 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse hover:animate-none"
            >
              Participer Maintenant
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContestCard;