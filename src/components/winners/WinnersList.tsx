import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import WinnerDisplay from "./WinnerDisplay";

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {contests.map((contest) => {
        const winners = getWinners(contest);
        if (winners.length === 0) return null;

        return winners.map((winner: any) => (
          <div key={winner.id} className="space-y-4">
            <WinnerDisplay winner={winner} contestTitle={contest.title} />
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
          </div>
        ));
      })}
    </div>
  );
};

export default WinnersList;