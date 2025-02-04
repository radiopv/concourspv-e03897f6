import React from 'react';
import { Trophy, Lock, Calendar, Gift, Users, Award } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RANK_POINTS } from '@/constants/ranks';

interface ContestCardProps {
  contest: {
    id: string;
    title: string;
    description?: string;
    is_new: boolean;
    has_big_prizes: boolean;
    participants?: { count: number };
    prizes?: any[];
    is_rank_restricted?: boolean;
    min_rank?: string;
    end_date: string;
    draw_date: string;
    status: string;
  };
  onSelect: (id: string) => void;
  index: number;
  userRank?: string;
}

const ContestCard = ({ contest, onSelect, index, userRank = 'NOVATO' }: ContestCardProps) => {
  const getStatusInfo = (status: string, endDate: string, drawDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const draw = new Date(drawDate);

    if (now > draw) {
      return {
        label: "Résultats disponibles",
        color: "bg-green-500 text-white"
      };
    }
    if (now > end) {
      return {
        label: "Fermé",
        color: "bg-red-500 text-white"
      };
    }
    return {
      label: "En cours",
      color: "bg-blue-500 text-white"
    };
  };

  const statusInfo = getStatusInfo(contest.status, contest.end_date, contest.draw_date);

  const isLocked = contest.is_rank_restricted && contest.min_rank && 
    RANK_POINTS[userRank as keyof typeof RANK_POINTS] < RANK_POINTS[contest.min_rank as keyof typeof RANK_POINTS];

  const backgroundColors = [
    'from-[#F2FCE2] to-[#E5F5D3]',
    'from-[#FEF7CD] to-[#FDF0B0]',
    'from-[#E5DEFF] to-[#D6BCFA]',
    'from-[#D3E4FD] to-[#B9D5FC]',
    'from-[#FFDEE2] to-[#FFD0D6]',
    'from-[#FDE1D3] to-[#FCD1BA]'
  ];

  const bgColorClass = backgroundColors[index % backgroundColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className={`bg-gradient-to-br ${bgColorClass} shadow-xl hover:shadow-2xl transition-all duration-300 border-gray-200/20 h-full flex flex-col ${isLocked ? 'opacity-75' : ''}`}>
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-800">{contest.title}</h3>
            <Badge className={statusInfo.color}>
              {statusInfo.label}
            </Badge>
          </div>

          {contest.description && (
            <p className="text-gray-700 mb-4 line-clamp-2">{contest.description}</p>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
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
          </div>

          <div className="space-y-3 flex-grow">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-4 h-4" />
              <span>Fin le {format(new Date(contest.end_date), 'dd MMMM yyyy', { locale: fr })}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-700">
              <Trophy className="w-4 h-4" />
              <span>Tirage le {format(new Date(contest.draw_date), 'dd MMMM yyyy', { locale: fr })}</span>
            </div>

            {contest.participants && (
              <div className="flex items-center gap-2 text-gray-700">
                <Users className="w-4 h-4" />
                <span>{contest.participants.count} participants</span>
              </div>
            )}

            {contest.prizes && contest.prizes.length > 0 && (
              <div className="flex items-center gap-2 text-gray-700">
                <Gift className="w-4 h-4" />
                <span>{contest.prizes.length} prix à gagner</span>
              </div>
            )}
          </div>

          <Button
            onClick={() => onSelect(contest.id)}
            className={`w-full mt-6 ${
              isLocked 
                ? 'bg-gray-500 hover:bg-gray-600' 
                : 'bg-gradient-to-r from-[#9b87f5] to-[#F97316] hover:from-[#8B5CF6] hover:to-[#D946EF]'
            } text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300`}
            disabled={isLocked}
          >
            {isLocked ? (
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Rang {contest.min_rank} requis</span>
              </div>
            ) : (
              'Participer Maintenant'
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContestCard;