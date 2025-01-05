import React from 'react';
import { Trophy } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ContestWinnerProps {
  winner: {
    first_name: string;
    last_name: string;
    created_at: string;
  };
}

const ContestWinner = ({ winner }: ContestWinnerProps) => {
  return (
    <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
      <div className="flex items-center gap-3">
        <Trophy className="w-5 h-5 text-amber-600" />
        <div className="flex-1">
          <h4 className="font-medium text-amber-900">Gagnant</h4>
          <div className="flex items-center gap-2 mt-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-amber-200 text-amber-700 text-sm">
                {winner.first_name[0]}{winner.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-amber-900 font-medium">
                {winner.first_name} {winner.last_name}
              </p>
              <p className="text-xs text-amber-700">
                Le {format(new Date(winner.created_at), 'dd MMMM yyyy', { locale: fr })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestWinner;