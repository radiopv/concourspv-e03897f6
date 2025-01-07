import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContestWithParticipantCount } from "@/types/contest";

interface ContestCardProps {
  contest: ContestWithParticipantCount;
  onSelect: (id: string) => void;
  index: number;
}

const ContestCard = ({ contest, onSelect, index }: ContestCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow glass-card">
        <CardContent className="flex-1 flex flex-col p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold">{contest.title}</h3>
            {contest.is_new && (
              <Badge variant="secondary" className="bg-blue-500 text-white">
                Nouveau
              </Badge>
            )}
          </div>

          {contest.description && (
            <p className="text-gray-600 mb-4">
              {contest.description}
            </p>
          )}

          {contest.has_big_prizes && (
            <Badge 
              variant="secondary" 
              className="bg-amber-500 text-white flex items-center gap-1 w-fit mb-4"
            >
              <Trophy className="w-4 h-4" />
              Gros lots à gagner
            </Badge>
          )}

          <div className="mt-auto">
            <div className="text-sm text-gray-600 mb-4">
              {contest.participants?.count || 0} participants
            </div>

            <Button 
              onClick={() => onSelect(contest.id)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
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