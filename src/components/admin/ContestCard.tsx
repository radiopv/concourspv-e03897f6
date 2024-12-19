import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Percent, ExternalLink, Gift, Edit, Archive } from "lucide-react";
import { motion } from "framer-motion";
import ContestStats from "@/components/contests/ContestStats";
import ContestCardToggles from './contest-card/ContestCardToggles';
import { useContestMutations } from './hooks/useContestMutations';

interface ContestCardProps {
  contest: {
    id: string;
    title: string;
    description?: string;
    is_new: boolean;
    has_big_prizes: boolean;
    is_featured: boolean;
    status: string;
    participants?: { count: number };
    prize_image_url?: string;
    shop_url?: string;
  };
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  index: number;
}

const ContestCard = ({ contest, onSelect, onEdit, index }: ContestCardProps) => {
  const { featureToggleMutation, statusUpdateMutation } = useContestMutations();

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
            shop_url,
            value
          )
        `)
        .eq('contest_id', contest.id);
      return prizesData || [];
    },
  });

  const { data: eligibleParticipants } = useQuery({
    queryKey: ['eligible-participants', contest.id],
    queryFn: async () => {
      const { count } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true })
        .eq('contest_id', contest.id)
        .gte('score', 70)
        .throwOnError();
      
      return count || 0;
    }
  });

  const calculateWinningChance = (eligibleCount: number, totalPrizes: number = prizes?.length || 1) => {
    if (eligibleCount === 0) return 100;
    return Math.round((totalPrizes / eligibleCount) * 100);
  };

  const handleFeatureToggle = (id: string, featured: boolean) => {
    featureToggleMutation.mutate({ id, featured });
  };

  const handleStatusUpdate = (id: string, updates: { is_new?: boolean; has_big_prizes?: boolean }) => {
    statusUpdateMutation.mutate({ id, updates });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow glass-card">
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-xl font-bold">{contest.title}</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(contest.id)}
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <ContestCardToggles
            contestId={contest.id}
            isFeatured={contest.is_featured}
            isNew={contest.is_new}
            hasBigPrizes={contest.has_big_prizes}
            onFeatureToggle={handleFeatureToggle}
            onStatusUpdate={handleStatusUpdate}
          />
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          {contest.description && (
            <p className="text-gray-600 mb-6">
              {contest.description}
            </p>
          )}
          
          <ContestStats contestId={contest.id} />
          
          {contest.prize_image_url && (
            <div className="relative group mb-6">
              <img
                src={contest.prize_image_url}
                alt="Prix principal"
                className="w-full h-48 object-cover rounded-lg"
              />
              {contest.shop_url && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <a
                    href={contest.shop_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white bg-purple-600 px-4 py-2 rounded-full hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Voir sur la boutique
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
            <div className="bg-white/50 p-4 rounded-lg">
              <p className="font-medium flex items-center gap-1 mb-1">
                <Users className="w-4 h-4 text-indigo-600" />
                Participants éligibles
              </p>
              <p className="text-2xl font-bold text-indigo-600">
                {eligibleParticipants || 0}
              </p>
            </div>
            <div className="bg-white/50 p-4 rounded-lg">
              <p className="font-medium flex items-center gap-1 mb-1">
                <Percent className="w-4 h-4 text-green-600" />
                Chances de gagner
              </p>
              <p className="text-2xl font-bold text-green-600">
                {calculateWinningChance(eligibleParticipants || 0)}%
              </p>
            </div>
          </div>

          <Button 
            onClick={() => onSelect(contest.id)}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3"
          >
            Gérer le concours
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContestCard;