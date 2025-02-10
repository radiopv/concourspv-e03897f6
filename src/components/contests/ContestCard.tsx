import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Star, Gift, ExternalLink, DollarSign, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Prize } from "@/types/prize";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ParticipationStats from './contest-card/ParticipationStats';

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
  };
  onSelect: (id: string) => void;
  index: number;
  userRank?: string;
}

const RANK_POINTS = {
  'NOVATO': 0,
  'HAVANA': 1000,
  'SANTIAGO': 2500,
  'RIO': 5000,
  'CARNIVAL': 10000,
  'ELDORADO': 25000
};

const ContestCard = ({ contest, onSelect, index, userRank = 'NOVATO' }: ContestCardProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: stats } = useQuery({
    queryKey: ['contest-detailed-stats', contest.id],
    queryFn: async () => {
      const { data: allParticipants } = await supabase
        .from('participants')
        .select('score, status')
        .eq('contest_id', contest.id)
        .eq('status', 'completed');

      if (!allParticipants) return null;

      const validParticipants = allParticipants.filter(p => p.score != null && p.score > 0);
      const eligibleParticipants = allParticipants.filter(p => p.score != null && p.score >= 90);
      
      const averageScore = validParticipants.length > 0
        ? Math.round(validParticipants.reduce((acc, p) => acc + (p.score || 0), 0) / validParticipants.length)
        : 0;

      console.log('Contest Stats Calculation:', {
        contestId: contest.id,
        totalParticipants: allParticipants.length,
        validParticipants: validParticipants.length,
        eligibleParticipants: eligibleParticipants.length,
        averageScore
      });

      return {
        totalParticipants: allParticipants.length,
        eligibleParticipants: eligibleParticipants.length,
        averageScore
      };
    }
  });

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
            <div className="flex flex-wrap gap-2">
              {contest.is_new && (
                <Badge className="bg-[#9b87f5] text-white">
                  Nouveau
                </Badge>
              )}
              {contest.has_big_prizes && (
                <Badge className="bg-[#F97316] text-white">
                  Gros Lots
                </Badge>
              )}
              {contest.is_rank_restricted && contest.min_rank && (
                <Badge className={isLocked ? "bg-red-500 text-white" : "bg-green-500 text-white"}>
                  {isLocked ? <Lock className="w-3 h-3 mr-1 inline" /> : null}
                  Rang {contest.min_rank}
                </Badge>
              )}
            </div>
          </div>
          {contest.description && (
            <p className="text-gray-700 mt-4 text-sm leading-relaxed">
              {contest.description}
            </p>
          )}
          {contest.start_date && contest.end_date && (
            <div className="mt-4 text-sm text-gray-600">
              <p>Du {format(new Date(contest.start_date), 'dd MMMM yyyy', { locale: fr })}</p>
              <p>Au {format(new Date(contest.end_date), 'dd MMMM yyyy', { locale: fr })}</p>
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-6 space-y-6 flex-grow">
          {stats && (
            <ParticipationStats 
              participantsCount={stats.totalParticipants}
              eligibleCount={stats.eligibleParticipants}
              averageScore={stats.averageScore}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/50 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 text-[#9b87f5] mb-2">
                <Users className="w-4 h-4" />
                <h3 className="font-medium">Participants</h3>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {stats?.totalParticipants || 0}
              </p>
            </div>

            <div className="bg-white/50 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 text-[#F97316] mb-2">
                <Star className="w-4 h-4" />
                <h3 className="font-medium">Score Moyen</h3>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {stats?.averageScore || 0}%
              </p>
            </div>

            <div className="bg-white/50 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 text-[#9b87f5] mb-2">
                <Trophy className="w-4 h-4" />
                <h3 className="font-medium">Éligibles</h3>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {stats?.qualifiedParticipants || 0}
              </p>
            </div>
          </div>

          {contest.prizes && contest.prizes.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800 justify-center">
                <Gift className="w-5 h-5 text-[#F97316]" />
                Prix à gagner
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {contest.prizes.map((prize) => (
                  <div 
                    key={prize.id} 
                    className="group relative overflow-hidden rounded-lg border border-gray-200/20 bg-white/70 backdrop-blur-sm p-4"
                  >
                    <div className="flex items-center gap-4">
                      {prize.image_url && (
                        <div className="w-20 h-20 flex-shrink-0">
                          <img
                            src={prize.image_url}
                            alt={prize.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className="flex-grow">
                        <h4 className="font-semibold text-gray-800">
                          {prize.name}
                        </h4>
                        {prize.value && (
                          <p className="flex items-center gap-1 text-[#F97316] text-sm mt-1">
                            <DollarSign className="w-4 h-4" />
                            Valeur: {prize.value} CAD $
                          </p>
                        )}
                        {prize.shop_url && (
                          <a
                            href={prize.shop_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-[#9b87f5] hover:text-[#F97316] transition-colors mt-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Voir le cadeau
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
