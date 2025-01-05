import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Gift } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface WinnerDisplayProps {
  winner: {
    first_name: string;
    last_name: string;
    score: number;
    created_at: string;
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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-gradient-to-r from-amber-50 to-amber-100">
      <CardHeader className="border-b border-amber-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 bg-amber-200">
              <AvatarFallback className="bg-amber-100 text-amber-700">
                {winner.first_name[0]}{winner.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <Trophy className="w-5 h-5 text-amber-600" />
                <span>{winner.first_name} {winner.last_name}</span>
              </CardTitle>
              <p className="text-sm text-amber-700 mt-1">Score: {winner.score}%</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="text-gray-700">
          <p className="font-medium text-lg">{contestTitle}</p>
          <p className="text-sm text-gray-500">
            Gagné le {format(new Date(winner.created_at), 'dd MMMM yyyy', { locale: fr })}
          </p>
        </div>

        {winner.prize?.[0]?.catalog_item && (
          <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
            <p className="font-medium flex items-center gap-2 text-purple-700">
              <Gift className="w-5 h-5" />
              Prix remporté
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="aspect-square relative rounded-lg overflow-hidden shadow-md">
                <img 
                  src={winner.prize[0].catalog_item.image_url} 
                  alt={winner.prize[0].catalog_item.name}
                  className="object-cover w-full h-full hover:scale-105 transition-transform"
                />
              </div>
              <div className="space-y-2 flex flex-col justify-center">
                <h3 className="font-semibold text-lg text-gray-900">
                  {winner.prize[0].catalog_item.name}
                </h3>
                <p className="text-purple-600 font-medium text-lg">
                  Valeur: {winner.prize[0].catalog_item.value}€
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WinnerDisplay;