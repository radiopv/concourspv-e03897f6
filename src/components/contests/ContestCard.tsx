import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import ContestPrizes from './contest-card/ContestPrizes';
import ParticipationStats from './contest-card/ParticipationStats';
import type { Contest } from '@/types/contest';

interface ContestCardProps {
  contest: Contest;
  onSelect?: (id: string) => void;
  index?: number;
}

const ContestCard = ({ contest, onSelect, index = 0 }: ContestCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleParticipate = () => {
    if (!contest.id) {
      console.error('Contest ID is missing:', contest);
      toast({
        title: "Erreur",
        description: "ID du concours manquant",
        variant: "destructive",
      });
      return;
    }
    
    console.log('Navigating to contest:', contest.id);
    navigate(`/contests/${contest.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full bg-white/50 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="text-center">
          <h2 className="text-2xl font-bold text-purple-900">{contest.title}</h2>
          {contest.description && (
            <p className="text-gray-600">{contest.description}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <ParticipationStats
            participantsCount={contest.participants?.count || 0}
            questionsCount={contest.questions?.count || 0}
          />
          
          {contest.prizes && contest.prizes.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-purple-700">
                <Trophy className="w-6 h-6" />
                <span>Prix à gagner</span>
              </div>
              <ContestPrizes prizes={contest.prizes} />
            </div>
          )}

          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            onClick={handleParticipate}
          >
            Participer maintenant
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContestCard;