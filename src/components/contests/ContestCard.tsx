import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Star, Target, Gift, ExternalLink, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { Prize } from '@/types/contest';

interface ContestCardProps {
  contest: {
    id: string;
    title: string;
    description?: string;
    is_new: boolean;
    has_big_prizes: boolean;
    participants?: { count: number };
    prizes?: Prize[];
  };
  onSelect: (id: string) => void;
  index: number;
}

const ContestCard = ({ contest, onSelect, index }: ContestCardProps) => {
  const navigate = useNavigate();

  const handleParticipate = () => {
    navigate(`/contest/${contest.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="w-full"
    >
      <Card className="bg-gradient-to-br from-[#1A1F2C] to-[#2D243B] text-white shadow-xl hover:shadow-2xl transition-all duration-300 border-[#9b87f5]/20">
        <CardHeader className="border-b border-[#9b87f5]/20 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#F97316] bg-clip-text text-transparent">
              {contest.title}
            </CardTitle>
            <div className="flex gap-2">
              {contest.is_new && (
                <Badge className="bg-[#F97316] text-white">
                  Nouveau
                </Badge>
              )}
              {contest.has_big_prizes && (
                <Badge className="bg-[#9b87f5] text-white">
                  Gros Lots
                </Badge>
              )}
            </div>
          </div>
          {contest.description && (
            <p className="text-gray-300 mt-2">{contest.description}</p>
          )}
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <div className="bg-black/30 p-4 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-2 text-[#9b87f5] mb-2">
              <Users className="w-4 h-4" />
              <h3 className="font-medium">Participants</h3>
            </div>
            <p className="text-2xl font-bold text-white">
              {contest.participants?.count || 0}
            </p>
          </div>

          {contest.prizes && contest.prizes.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-[#F97316] justify-center">
                <Gift className="w-5 h-5" />
                Prix à gagner
              </h3>
              <p className="text-center text-gray-300 italic mb-4">
                Le gagnant pourra choisir l'un des deux prix suivants
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {contest.prizes.map((prize) => (
                  <div 
                    key={prize.id} 
                    className="group relative overflow-hidden rounded-lg border border-[#9b87f5]/20 bg-black/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                  >
                    {prize.image_url && (
                      <div className="aspect-video relative">
                        <img
                          src={prize.image_url}
                          alt={prize.name}
                          className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-4 space-y-3">
                      <h4 className="font-semibold text-lg text-[#9b87f5] text-center">
                        {prize.name}
                      </h4>
                      {prize.value && (
                        <p className="flex items-center justify-center gap-1 text-[#F97316] font-medium">
                          <DollarSign className="w-4 h-4" />
                          Valeur: {prize.value} CAD $
                        </p>
                      )}
                      {prize.shop_url && (
                        <div className="text-center">
                          <a
                            href={prize.shop_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1 text-sm text-[#9b87f5] hover:text-[#F97316] transition-colors bg-black/20 px-4 py-2 rounded-full hover:bg-black/40"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Voir le cadeau
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleParticipate}
              className="bg-gradient-to-r from-[#9b87f5] to-[#F97316] hover:from-[#8B5CF6] hover:to-[#D946EF] text-white font-bold py-6 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse hover:animate-none"
            >
              Participer Maintenant
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContestCard;