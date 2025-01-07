import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { Participant, PARTICIPANT_STATUS } from "@/types/participant";
import ContestStats from "./ContestStats";
import UserProgress from "./contest-card/UserProgress";
import ContestPrizes from "./contest-card/ContestPrizes";
import ParticipationStats from "./contest-card/ParticipationStats";
import ContestWinner from "./contest-card/ContestWinner";

interface ContestCardProps {
  contest: {
    id: string;
    title: string;
    description?: string;
    is_new: boolean;
    has_big_prizes: boolean;
    status: string;
    participants?: Participant[];
  };
  onSelect: (id: string) => void;
  index: number;
}

const ContestCard = ({ contest, onSelect, index }: ContestCardProps) => {
  // Find winner if contest has one
  const winner = contest.participants?.find(p => p.status === PARTICIPANT_STATUS.WINNER);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow glass-card float">
        <CardContent className="p-6 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">{contest.title}</h2>
            {contest.is_new && (
              <Badge variant="secondary" className="bg-blue-500 text-white">
                Nouveau
              </Badge>
            )}
          </div>

          {contest.description && (
            <p className="text-gray-600 mb-6">
              {contest.description}
            </p>
          )}

          {contest.has_big_prizes && (
            <Badge variant="secondary" className="bg-amber-500 text-white flex items-center gap-1 w-fit mb-4">
              <Trophy className="w-4 h-4" />
              Gros lots à gagner
            </Badge>
          )}
          
          <ContestStats contestId={contest.id} />

          {winner && <ContestWinner winner={winner} />}

          <div className="mt-auto pt-4">
            <Button 
              onClick={() => onSelect(contest.id)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              Participer
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContestCard;