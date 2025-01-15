import React from 'react';
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Trophy, Gift, Users, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

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

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <div className="relative h-full bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 shadow-xl">
        {contest.is_new && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-amber-500 text-white font-semibold px-3 py-1">
              NOUVEAU
            </Badge>
          </div>
        )}

        {mainPrize?.image_url && (
          <div className="relative aspect-video">
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent" />
            <img
              src={mainPrize.image_url}
              alt={mainPrize.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <h3 className="text-2xl font-bold text-white mb-3">
            {contest.title}
          </h3>

          {contest.description && (
            <p className="text-gray-300 mb-4">
              {contest.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 rounded-lg p-3">
              <Users className="w-5 h-5 text-blue-400 mb-1" />
              <p className="text-sm text-gray-400">Participants</p>
              <p className="text-xl font-bold text-white">
                {contest.participants?.count || 0}
              </p>
            </div>
            {mainPrize && (
              <div className="bg-white/5 rounded-lg p-3">
                <Gift className="w-5 h-5 text-pink-400 mb-1" />
                <p className="text-sm text-gray-400">Prix Principal</p>
                <p className="text-xl font-bold text-white">
                  {mainPrize.value}€
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => onSelect(contest.id)}
            className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center gap-2 group"
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