import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Percent, ExternalLink, Gift, HelpCircle } from "lucide-react";
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
    questions?: { count: number };
  };
  onSelect: (id: string) => void;
  index: number;
}

interface PrizeCatalogItem {
  name: string;
  image_url?: string;
  shop_url?: string;
  value: number;
}

interface Prize {
  prize_catalog: PrizeCatalogItem;
}

const ContestCard = ({ contest, onSelect, index }: ContestCardProps) => {
  const { data: prizesData } = useQuery({
    queryKey: ['contest-prizes', contest.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('prizes')
        .select(`
          prize_catalog (
            name,
            image_url,
            shop_url,
            value
          )
        `)
        .eq('contest_id', contest.id);
      
      // Transform the data to match our Prize interface
      return (data || []).map(item => ({
        prize_catalog: item.prize_catalog[0] // Take the first item since it's returning an array
      })) as Prize[];
    },
  });

  const totalPrizeValue = prizesData?.reduce((total, prize) => {
    return total + (prize.prize_catalog?.value || 0);
  }, 0);

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
            {contest.is_new && (
              <Badge variant="secondary" className="bg-blue-500 text-white">
                Nouveau
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {contest.has_big_prizes && (
              <Badge variant="secondary" className="bg-amber-500 text-white flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                Gros lots à gagner
              </Badge>
            )}
            <Badge variant="outline" className="flex items-center gap-1">
              <HelpCircle className="w-4 h-4" />
              {contest.questions?.count || 0} questions
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {contest.description && (
            <p className="text-gray-600 mb-6">
              {contest.description}
            </p>
          )}
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Gift className="w-5 h-5 text-purple-500" />
              Prix à gagner ({totalPrizeValue}€)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prizesData?.map((prize, idx) => (
                prize.prize_catalog && (
                  <div key={idx} className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white/50 backdrop-blur-sm">
                    {prize.prize_catalog.image_url ? (
                      <div className="aspect-video relative">
                        <img
                          src={prize.prize_catalog.image_url}
                          alt={prize.prize_catalog.name}
                          className="w-full h-full object-cover"
                        />
                        {prize.prize_catalog.shop_url && (
                          <a
                            href={prize.prize_catalog.shop_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <span className="text-white bg-purple-600 px-4 py-2 rounded-full hover:bg-purple-700 transition-colors flex items-center gap-2">
                              <ExternalLink className="w-4 h-4" />
                              Voir le prix
                            </span>
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="aspect-video bg-gray-100 flex items-center justify-center">
                        <Gift className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="p-3">
                      <p className="font-medium text-purple-700">{prize.prize_catalog.name}</p>
                      <p className="text-sm text-gray-500">{prize.prize_catalog.value}€</p>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>

          <ContestStats contestId={contest.id} />

          <Button 
            onClick={() => onSelect(contest.id)}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 mt-auto"
          >
            Participer
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContestCard;