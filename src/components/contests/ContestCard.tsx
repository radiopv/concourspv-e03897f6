import React from 'react';
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Calendar, Gift } from "lucide-react";
import { Contest } from "@/types/contest";

interface ContestCardProps {
  contest: Contest;
  onSelect: (id: string) => void;
  index: number;
}

const ContestCard = ({ contest, onSelect, index }: ContestCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="h-full"
    >
      <Card 
        onClick={() => onSelect(contest.id)}
        className="cursor-pointer h-full overflow-hidden bg-black/30 border-[#9b87f5]/20 hover:border-[#9b87f5]/40 transition-all duration-300"
      >
        <CardContent className="p-0">
          {/* Image principale du concours */}
          {contest.main_image_url && (
            <div className="aspect-video relative">
              <img
                src={contest.main_image_url}
                alt={contest.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#9b87f5]">{contest.title}</h3>
              {contest.description && (
                <p className="text-gray-300 line-clamp-2">{contest.description}</p>
              )}
            </div>

            {/* Dates du concours */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Calendar className="w-4 h-4 text-[#F97316]" />
                <span>
                  Du {format(new Date(contest.start_date), 'dd MMMM yyyy', { locale: fr })} au{' '}
                  {format(new Date(contest.end_date), 'dd MMMM yyyy', { locale: fr })}
                </span>
              </div>
              {contest.draw_date && (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Trophy className="w-4 h-4 text-[#F97316]" />
                  <span>
                    Tirage le {format(new Date(contest.draw_date), 'dd MMMM yyyy', { locale: fr })}
                  </span>
                </div>
              )}
            </div>

            {/* Prix à gagner */}
            {contest.prizes && contest.prizes.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-lg font-semibold flex items-center gap-2 text-[#F97316]">
                  <Gift className="w-5 h-5" />
                  Prix à gagner
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {contest.prizes.map((prize, idx) => (
                    <div key={idx} className="relative group">
                      {prize.image_url && (
                        <div className="aspect-video relative rounded-lg overflow-hidden">
                          <img
                            src={prize.image_url}
                            alt={prize.name}
                            className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
                          />
                          {prize.value && (
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                              ${prize.value}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContestCard;