import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Gift, Medal } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface WinnersListProps {
  contests: any[];
  onClaimPrize: (winner: any) => void;
  showAll: boolean;
}

const WinnersList = ({ contests, onClaimPrize, showAll }: WinnersListProps) => {
  const getWinners = (contest: any) => {
    const winners = contest.participants?.filter((p: any) => p.status === 'winner') || [];
    if (!showAll) {
      return winners.filter((w: any) => !w.prize_claimed);
    }
    return winners;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contests.map((contest) => {
        const winners = getWinners(contest);
        if (winners.length === 0) return null;

        return winners.map((winner: any) => (
          <Card key={winner.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{winner.first_name} {winner.last_name}</span>
                <Trophy className="w-5 h-5 text-amber-500" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Concours</p>
                <p className="font-medium">{contest.title}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Prix gagné</p>
                <div className="flex items-center gap-2">
                  {winner.prize?.[0]?.catalog_item?.image_url && (
                    <img 
                      src={winner.prize[0].catalog_item.image_url} 
                      alt={winner.prize[0].catalog_item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <p className="font-medium">{winner.prize?.[0]?.catalog_item?.name}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Date du tirage</p>
                <p>{format(new Date(winner.updated_at), 'dd MMMM yyyy', { locale: fr })}</p>
              </div>

              {!winner.prize_claimed && (
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => onClaimPrize(winner)}
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Réclamer le prix
                </Button>
              )}

              {winner.prize_claimed && (
                <div className="bg-green-50 text-green-800 p-3 rounded-lg text-sm flex items-center gap-2">
                  <Medal className="w-4 h-4" />
                  Prix réclamé le {format(new Date(winner.prize_claimed_at), 'dd/MM/yyyy')}
                </div>
              )}
            </CardContent>
          </Card>
        ));
      })}
    </div>
  );
};

export default WinnersList;