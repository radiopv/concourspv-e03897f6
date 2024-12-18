import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Percent, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface ContestCardProps {
  contest: {
    id: string;
    title: string;
    description?: string;
    is_new: boolean;
    has_big_prizes: boolean;
    prize_image_url?: string;
    shop_url?: string;
    participants?: { count: number };
  };
  onSelect: (id: string) => void;
  index: number;
}

const ContestCard = ({ contest, onSelect, index }: ContestCardProps) => {
  const calculateWinningChance = (participants: number, totalPrizes: number = 1) => {
    if (participants === 0) return 100;
    return Math.round((totalPrizes / participants) * 100);
  };

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
          
          {contest.prize_image_url && (
            <div className="aspect-video relative overflow-hidden rounded-lg mb-6 group">
              <img
                src={contest.prize_image_url}
                alt="Prix à gagner"
                className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
              />
              {contest.shop_url && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <a
                    href={contest.shop_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white bg-amber-500 px-4 py-2 rounded-full hover:bg-amber-600 transition-colors flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Voir le prix sur la boutique
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
            <div className="bg-white/50 p-4 rounded-lg">
              <p className="font-medium flex items-center gap-1 mb-1">
                <Users className="w-4 h-4 text-indigo-600" />
                Participants
              </p>
              <p className="text-2xl font-bold text-indigo-600">
                {contest.participants?.count || 0}
              </p>
            </div>
            <div className="bg-white/50 p-4 rounded-lg">
              <p className="font-medium flex items-center gap-1 mb-1">
                <Percent className="w-4 h-4 text-green-600" />
                Chances
              </p>
              <p className="text-2xl font-bold text-green-600">
                {calculateWinningChance(contest.participants?.count || 0)}%
              </p>
            </div>
          </div>

          <Button 
            onClick={() => onSelect(contest.id)}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3"
          >
            Participer
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContestCard;