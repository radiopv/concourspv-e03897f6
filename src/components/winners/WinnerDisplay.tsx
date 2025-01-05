import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Gift, Medal, User } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface WinnerDisplayProps {
  winner: {
    first_name: string;
    last_name: string;
    score: number;
    updated_at: string;
    prize_claimed: boolean;
    prize_claimed_at?: string;
    prize?: Array<{
      catalog_item: {
        name: string;
        value: string;
        image_url: string;
      }
    }>;
  };
  contestTitle: string;
}

const WinnerDisplay = ({ winner, contestTitle }: WinnerDisplayProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="bg-gradient-to-r from-amber-100 to-amber-200">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-600" />
            <span>{winner.first_name} {winner.last_name}</span>
          </CardTitle>
          <span className="text-amber-700 font-semibold">{winner.score}%</span>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="text-gray-600">
          <p className="font-medium">Concours gagné</p>
          <p>{contestTitle}</p>
        </div>

        {winner.prize?.[0]?.catalog_item && (
          <div className="space-y-2">
            <p className="font-medium flex items-center gap-2">
              <Gift className="w-4 h-4 text-purple-500" />
              Prix remporté
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <img 
                  src={winner.prize[0].catalog_item.image_url} 
                  alt={winner.prize[0].catalog_item.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="space-y-2">
                <p className="font-semibold">{winner.prize[0].catalog_item.name}</p>
                <p className="text-purple-600 font-medium">
                  Valeur: {winner.prize[0].catalog_item.value}€
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <p className="text-sm text-gray-500">
            Date du tirage: {format(new Date(winner.updated_at), 'dd MMMM yyyy', { locale: fr })}
          </p>
          {winner.prize_claimed && (
            <div className="mt-2 flex items-center gap-2 text-green-600">
              <Medal className="w-4 h-4" />
              <span className="text-sm">
                Prix réclamé le {format(new Date(winner.prize_claimed_at!), 'dd/MM/yyyy')}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WinnerDisplay;