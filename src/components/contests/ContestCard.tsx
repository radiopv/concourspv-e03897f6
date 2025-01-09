import React from 'react';
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

// Types pour les données brutes de l'API
interface RawPrizeData {
  catalog_item_id: string;
  prize_catalog: {
    name: string;
    image_url: string;
    shop_url: string;
    value: number;
  };
}

// Type pour le format final des prix
interface Prize {
  prize_catalog: {
    name: string;
    image_url: string;
    shop_url: string;
    value: number;
  };
}

interface ContestCardProps {
  contest: {
    id: string;
    title: string;
    description?: string;
    is_new: boolean;
    has_big_prizes: boolean;
    participants?: { count: number };
  };
  onSelect: (id: string) => void;
  index: number;
}

const ContestCard = ({ contest, onSelect, index }: ContestCardProps) => {
  const { data: prizes } = useQuery({
    queryKey: ['contest-prizes', contest.id],
    queryFn: async () => {
      console.log('Fetching prizes for contest:', contest.id);
      const { data: prizesData, error } = await supabase
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

      if (error) throw error;
      
      // Transformation des données pour correspondre au type Prize[]
      const transformedPrizes: Prize[] = (prizesData || []).map((item: RawPrizeData) => ({
        prize_catalog: item.prize_catalog
      }));

      console.log('Prizes data:', transformedPrizes);
      return transformedPrizes;
    },
  });

  const { data: settings } = useQuery({
    queryKey: ['global-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    }
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

  const remainingAttempts = settings?.default_attempts 
    ? settings.default_attempts - (userParticipation?.attempts || 0)
    : 0;

  // Get the main prize from the first item in the prizes array
  const mainPrize = prizes?.[0]?.prize_catalog;

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

          {mainPrize && mainPrize.image_url && (
            <div className="mb-6">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <img
                  src={mainPrize.image_url}
                  alt={mainPrize.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          
          <ContestStats contestId={contest.id} />

          <UserProgress
            userParticipation={userParticipation}
            settings={settings}
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