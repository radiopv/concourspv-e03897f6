import React from 'react';
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Trophy, Gift, Users, Star, Calendar, Clock, ExternalLink, Coins } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card } from "@/components/ui/card";

interface ContestCardProps {
  contest: {
    id: string;
    title: string;
    description?: string;
    is_new: boolean;
    has_big_prizes: boolean;
    start_date?: string;
    end_date?: string;
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
          *,
          prize_catalog!fk_prize_catalog (
            name,
            image_url,
            shop_url,
            value,
            description
          )
        `)
        .eq('contest_id', contest.id);

      if (error) {
        console.error('Error fetching prizes:', error);
        throw error;
      }
      console.log('Prizes data:', prizesData);
      return prizesData || [];
    },
  });

  const mainPrize = prizes?.[0]?.prize_catalog;
  const totalPrizeValue = prizes?.reduce((sum, prize) => sum + (prize.prize_catalog?.value || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="h-full mx-auto max-w-2xl"
    >
      <Card className="overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 shadow-xl hover:shadow-2xl transition-all duration-300">
        {/* Badge Nouveau */}
        {contest.is_new && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold px-3 py-1">
              NOUVEAU
            </Badge>
          </div>
        )}

        {/* Image et lien du prix principal */}
        {mainPrize?.image_url && (
          <div className="relative aspect-video group">
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/80 to-transparent z-10" />
            <img
              src={mainPrize.image_url}
              alt={mainPrize.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            {mainPrize.value && (
              <div className="absolute top-4 left-4 z-20">
                <Badge className="bg-white/90 text-amber-800 px-3 py-1 font-bold text-lg">
                  {mainPrize.value}€
                </Badge>
              </div>
            )}
            {mainPrize.shop_url && (
              <a
                href={mainPrize.shop_url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 z-20 bg-white/90 hover:bg-white text-amber-800 px-3 py-1 rounded-full flex items-center gap-2 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Voir le cadeau
              </a>
            )}
          </div>
        )}

        <div className="p-6">
          {/* Titre et valeur totale */}
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-amber-800">
              {contest.title}
            </h3>
            {totalPrizeValue > 0 && (
              <div className="flex items-center gap-1 text-amber-700">
                <Coins className="w-5 h-5" />
                <span className="font-semibold">Valeur totale: {totalPrizeValue}€</span>
              </div>
            )}
          </div>

          {/* Description du concours */}
          {contest.description && (
            <p className="text-amber-700 mb-6">
              {contest.description}
            </p>
          )}

          {/* Détails du prix principal */}
          {mainPrize && (
            <div className="bg-white/50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-amber-800 flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5" />
                Prix principal
              </h4>
              <p className="text-lg font-medium text-amber-700">{mainPrize.name}</p>
              {mainPrize.description && (
                <p className="text-sm text-amber-600 mt-1">{mainPrize.description}</p>
              )}
            </div>
          )}

          {/* Statistiques */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-amber-50/50 rounded-lg p-3">
              <Users className="w-5 h-5 text-amber-600 mb-1" />
              <p className="text-sm text-amber-700">Participants</p>
              <p className="text-xl font-bold text-amber-800">
                {contest.participants?.count || 0}
              </p>
            </div>
            {prizes && prizes.length > 0 && (
              <div className="bg-amber-50/50 rounded-lg p-3">
                <Gift className="w-5 h-5 text-amber-600 mb-1" />
                <p className="text-sm text-amber-700">Nombre de prix</p>
                <p className="text-xl font-bold text-amber-800">
                  {prizes.length}
                </p>
              </div>
            )}
          </div>

          {/* Dates */}
          {(contest.start_date || contest.end_date) && (
            <div className="mb-6 space-y-2">
              {contest.start_date && (
                <div className="flex items-center text-amber-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    Début: {format(new Date(contest.start_date), 'dd MMMM yyyy', { locale: fr })}
                  </span>
                </div>
              )}
              {contest.end_date && (
                <div className="flex items-center text-amber-700">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    Fin: {format(new Date(contest.end_date), 'dd MMMM yyyy', { locale: fr })}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Bouton de participation */}
          <button
            onClick={() => onSelect(contest.id)}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105"
          >
            <Trophy className="w-5 h-5" />
            Participer au concours
          </button>
        </div>
      </Card>
    </motion.div>
  );
};

export default ContestCard;