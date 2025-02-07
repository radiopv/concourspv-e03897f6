
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Crown, Medal } from 'lucide-react';

interface Winner {
  id: string;
  participant: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
  contest: {
    id: string;
    title: string;
  } | null;
  prize: {
    id: string;
    name: string;
    description: string | null;
    image_url: string | null;
  } | null;
}

interface RecentWinnersListProps {
  winners: Winner[];
  isLoading: boolean;
}

const RecentWinnersList = ({ winners, isLoading }: RecentWinnersListProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <Card key={n} className="animate-pulse">
            <CardHeader className="h-32 bg-gray-200" />
            <CardContent className="space-y-2">
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!winners || winners.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <Trophy className="h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-lg font-semibold">Pas encore de gagnants</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Participez à nos concours pour avoir une chance de gagner !
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {winners.map((winner, index) => (
        <Card key={winner.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className={`relative ${winner.prize?.image_url ? 'h-48' : 'h-24'} w-full bg-gradient-to-r from-amber-100 to-amber-200`}>
            {winner.prize?.image_url ? (
              <img
                src={winner.prize.image_url}
                alt={winner.prize.name || 'Prix'}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                {index === 0 ? (
                  <Crown className="h-12 w-12 text-amber-500" />
                ) : index === 1 ? (
                  <Medal className="h-12 w-12 text-gray-400" />
                ) : index === 2 ? (
                  <Medal className="h-12 w-12 text-amber-700" />
                ) : (
                  <Trophy className="h-12 w-12 text-amber-300" />
                )}
              </div>
            )}
          </div>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              {winner.participant?.first_name} {winner.participant?.last_name}
              {index < 3 && (
                <span className="text-sm px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                  #{index + 1}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              A gagné {winner.prize?.name} dans le concours "{winner.contest?.title}"
            </p>
            {winner.prize?.description && (
              <p className="mt-2 text-sm text-gray-500">
                {winner.prize.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RecentWinnersList;
