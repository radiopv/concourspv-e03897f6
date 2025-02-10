
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ParticipationStats from './contest-card/ParticipationStats';
import ContestBadges from './contest-card/ContestBadges';
import ContestDates from './contest-card/ContestDates';
import ContestPrizes from './contest-card/ContestPrizes';
import { RANK_POINTS } from '@/constants/ranks';
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
    is_rank_restricted?: boolean;
    min_rank?: string;
    start_date?: string;
    end_date?: string;
    stats?: {
      totalParticipants: number;
      eligibleParticipants: number;
      averageScore: number;
    };
  };
  onSelect: (id: string) => void;
  index: number;
  userRank?: string;
}

const ContestCard = ({ contest, onSelect, index, userRank = 'NOVATO' }: ContestCardProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleParticipate = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter ou créer un compte pour participer au concours",
        variant: "default",
      });
      navigate('/login', { state: { returnUrl: `/contest/${contest.id}` } });
      return;
    }

    if (!contest.id) {
      console.error('Contest ID is missing');
      return;
    }

    if (contest.is_rank_restricted && contest.min_rank) {
      const requiredPoints = RANK_POINTS[contest.min_rank as keyof typeof RANK_POINTS];
      const userPoints = RANK_POINTS[userRank as keyof typeof RANK_POINTS];

      if (userPoints < requiredPoints) {
        toast({
          title: "Accès restreint",
          description: `Ce concours est réservé aux joueurs de rang ${contest.min_rank} et plus. Continuez à gagner des points pour y accéder !`,
          variant: "destructive",
        });
        return;
      }
    }

    onSelect(contest.id);
  };

  const cleanTitle = contest.title.replace(/Connaissance de base/g, '').replace(/\s+-\s+$/, '').trim();

  const backgroundColors = [
    'from-[#F2FCE2] to-[#E5F5D3]',
    'from-[#FEF7CD] to-[#FDF0B0]',
    'from-[#E5DEFF] to-[#D6BCFA]',
    'from-[#D3E4FD] to-[#B9D5FC]',
    'from-[#FFDEE2] to-[#FFD0D6]',
    'from-[#FDE1D3] to-[#FCD1BA]'
  ];

  const bgColorClass = backgroundColors[index % backgroundColors.length];
  const isLocked = contest.is_rank_restricted && contest.min_rank && 
    RANK_POINTS[userRank as keyof typeof RANK_POINTS] < RANK_POINTS[contest.min_rank as keyof typeof RANK_POINTS];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className={`bg-gradient-to-br ${bgColorClass} shadow-xl hover:shadow-2xl transition-all duration-300 border-gray-200/20 h-full flex flex-col ${isLocked ? 'opacity-75' : ''}`}>
        <CardHeader className="border-b border-gray-200/20 pb-4">
          <div className="flex flex-col gap-3">
            <CardTitle className="text-2xl font-bold text-gray-800">
              {cleanTitle}
            </CardTitle>
            <ContestBadges
              isNew={contest.is_new}
              hasBigPrizes={contest.has_big_prizes}
              isRankRestricted={contest.is_rank_restricted || false}
              minRank={contest.min_rank}
              isLocked={isLocked}
            />
          </div>
          {contest.description && (
            <p className="text-gray-700 mt-4 text-sm leading-relaxed">
              {contest.description}
            </p>
          )}
          <ContestDates
            startDate={contest.start_date}
            endDate={contest.end_date}
          />
        </CardHeader>

        <CardContent className="pt-6 space-y-6 flex-grow">
          {contest.stats && (
            <ParticipationStats 
              participantsCount={contest.stats.totalParticipants}
              eligibleCount={contest.stats.eligibleParticipants}
              averageScore={contest.stats.averageScore}
            />
          )}

          {contest.prizes && <ContestPrizes prizes={contest.prizes} />}

          <div className="mt-8 flex justify-center p-4">
            <Button
              onClick={handleParticipate}
              className={`w-full sm:w-auto ${
                isLocked 
                  ? 'bg-gray-500 hover:bg-gray-600' 
                  : 'bg-gradient-to-r from-[#9b87f5] to-[#F97316] hover:from-[#8B5CF6] hover:to-[#D946EF]'
              } text-white font-bold py-6 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300`}
              disabled={isLocked}
            >
              {isLocked ? 'Rang insuffisant' : (user ? 'Participer Maintenant' : 'Se connecter pour participer')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContestCard;
