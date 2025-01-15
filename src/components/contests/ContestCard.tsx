import React from 'react';
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Trophy, Gift, Users, Star, Calendar, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
  const { data: prizes } = useQuery({
    queryKey: ['contest-prizes', contest.id],
    queryFn: async () => {
      const { data: prizesData, error } = await supabase
        .from('prizes')
        .select(`
          *,
          catalog_item:prize_catalog!fk_prize_catalog (
            name,
            image_url,
            shop_url,
            value
          )
        `)
        .eq('contest_id', contest.id);

      if (error) throw error;
      return prizesData || [];
    },
  });

  const mainPrize = prizes?.[0]?.catalog_item;
  const totalPrizeValue = prizes?.reduce((sum, prize) => sum + (prize.catalog_item?.value || 0), 0);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <div className="tropical-card overflow-hidden">
        {contest.is_new && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold px-3 py-1">
              NOUVEAU
            </Badge>
          </div>
        )}

        {mainPrize?.image_url && (
          <div className="relative aspect-video">
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/80 to-transparent" />
            <img
              src={mainPrize.image_url}
              alt={mainPrize.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <h3 className="text-2xl font-bold text-amber-800 mb-3">
            {contest.title}
          </h3>

          {contest.description && (
            <p className="text-amber-700 mb-4">
              {contest.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-amber-50/50 rounded-lg p-3">
              <Users className="w-5 h-5 text-amber-600 mb-1" />
              <p className="text-sm text-amber-700">Participants</p>
              <p className="text-xl font-bold text-amber-800">
                {contest.participants?.count || 0}
              </p>
            </div>
            {totalPrizeValue && (
              <div className="bg-amber-50/50 rounded-lg p-3">
                <Gift className="w-5 h-5 text-amber-600 mb-1" />
                <p className="text-sm text-amber-700">Valeur des prix</p>
                <p className="text-xl font-bold text-amber-800">
                  {totalPrizeValue}€
                </p>
              </div>
            )}
          </div>

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

          <button
            onClick={() => onSelect(contest.id)}
            className="tropical-button w-full"
          >
            <Trophy className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Participer
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ContestCard;