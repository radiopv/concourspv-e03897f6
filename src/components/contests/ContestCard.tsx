import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import ContestStats from "./ContestStats";
import UserProgress from "./contest-card/UserProgress";
import ContestPrizes from "./contest-card/ContestPrizes";
import ParticipationStats from "./contest-card/ParticipationStats";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { data: prizes, isLoading: isPrizesLoading } = useQuery({
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
      
      return prizesData?.map((item: any) => ({
        prize_catalog: item.prize_catalog
      })) || [];
    },
  });

  const { data: settings, isLoading: isSettingsLoading } = useQuery({
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

  const { data: userParticipation, isLoading: isParticipationLoading } = useQuery({
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

  const mainPrize = prizes?.[0]?.prize_catalog;

  const isLoading = isPrizesLoading || isSettingsLoading || isParticipationLoading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card 
        className="h-full flex flex-col hover:shadow-lg transition-shadow glass-card float"
        role="article"
        aria-labelledby={`contest-title-${contest.id}`}
      >
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <CardTitle 
              id={`contest-title-${contest.id}`}
              className="text-xl font-bold"
            >
              {contest.title}
            </CardTitle>
            {contest.is_new && (
              <Badge 
                variant="secondary" 
                className="bg-blue-500 text-white"
                aria-label="Nouveau concours"
              >
                Nouveau
              </Badge>
            )}
          </div>
          {contest.has_big_prizes && (
            <Badge 
              variant="secondary" 
              className="bg-amber-500 text-white flex items-center gap-1 w-fit"
              aria-label="Gros lots disponibles"
            >
              <Trophy className="w-4 h-4" aria-hidden="true" />
              Gros lots à gagner
            </Badge>
          )}
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <>
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
                      loading="lazy"
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
                  aria-label={remainingAttempts > 0 ? 
                    `Participer au concours ${contest.title}` : 
                    'Plus de tentatives disponibles pour ce concours'}
                >
                  {remainingAttempts > 0 ? 'Participer' : 'Plus de tentatives disponibles'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContestCard;