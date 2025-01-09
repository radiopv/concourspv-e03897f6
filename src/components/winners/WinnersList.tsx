import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import WinnerDisplay from "./WinnerDisplay";

interface Winner {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  score: number;
  status: string;
  contest: {
    id: string;
    title: string;
  };
  participant_prizes: Array<{
    prize: {
      id: string;
      catalog_item: {
        name: string;
        value: number;
        image_url: string;
      };
    };
  }>;
}

interface WinnersListProps {
  winners: Winner[];
  onClaimPrize: (winner: Winner) => void;
  showAll: boolean;
}

const WinnersList = ({ winners, onClaimPrize, showAll }: WinnersListProps) => {
  const filteredWinners = showAll ? winners : winners.filter(w => !w.participant_prizes?.length);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredWinners.map((winner) => (
        <div key={winner.id} className="space-y-4">
          <WinnerDisplay 
            winner={winner} 
            contestTitle={winner.contest?.title || 'Concours'} 
          />
          {(!winner.participant_prizes?.length) && (
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
      ))}
      {filteredWinners.length === 0 && (
        <div className="col-span-full text-center py-8 text-gray-500">
          Aucun gagnant à afficher
        </div>
      )}
    </div>
  );
};

export default WinnersList;