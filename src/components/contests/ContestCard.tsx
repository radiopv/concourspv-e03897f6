import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Percent, ExternalLink, Gift, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../App";
import ContestStats from "./ContestStats";

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
      const { data: prizesData } = await supabase
        .from('prizes')
        .select(`
          catalog_item_id,
          prize_catalog (
            name,
            image_url,
            shop_url
          )
        `)
        .eq('contest_id', contest.id);
      return prizesData || [];
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
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  });

  const remainingAttempts = settings?.default_attempts 
    ? settings.default_attempts - (userParticipation?.attempts || 0)
    : 0;

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
          
          <ContestStats contestId={contest.id} />

          {userParticipation && (
            <div className="mb-6 space-y-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                <AlertCircle className="w-5 h-5 text-blue-500" />
                Votre progression
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Score requis</p>
                  <p className="text-lg font-bold text-blue-600">
                    {settings?.required_percentage || 70}%
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Tentatives restantes</p>
                  <p className={`text-lg font-bold ${remainingAttempts > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {remainingAttempts}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {prizes && prizes.length > 0 && (
            <div className="mb-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Gift className="w-5 h-5 text-purple-500" />
                Prix à gagner
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prizes.map((prize: any, idx: number) => (
                  prize.prize_catalog && (
                    <div key={idx} className="relative group overflow-hidden rounded-lg border border-gray-200">
                      {prize.prize_catalog.image_url && (
                        <div className="aspect-video relative">
                          <img
                            src={prize.prize_catalog.image_url}
                            alt={prize.prize_catalog.name}
                            className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
                          />
                          {prize.prize_catalog.shop_url && (
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <a
                                href={prize.prize_catalog.shop_url}
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
                      <div className="p-3 bg-white/80">
                        <p className="font-medium text-purple-700">{prize.prize_catalog.name}</p>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
            <div className="bg-white/50 p-4 rounded-lg">
              <p className="font-medium flex items-center gap-1 mb-1">
                <Users className="w-4 h-4 text-indigo-600" />
                Participants éligibles
              </p>
              <p className="text-2xl font-bold text-indigo-600">
                {contest.participants?.count || 0}
              </p>
            </div>
            <div className="bg-white/50 p-4 rounded-lg">
              <p className="font-medium flex items-center gap-1 mb-1">
                <Percent className="w-4 h-4 text-green-600" />
                Chances de gagner
              </p>
              <p className="text-2xl font-bold text-green-600">
                {calculateWinningChance(contest.participants?.count || 0)}%
              </p>
            </div>
          </div>

          <Button 
            onClick={() => onSelect(contest.id)}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3"
            disabled={remainingAttempts <= 0}
          >
            {remainingAttempts > 0 ? 'Participer' : 'Plus de tentatives disponibles'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContestCard;
