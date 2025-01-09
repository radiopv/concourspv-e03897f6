import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

interface Winner {
  id: string;
  participants: {
    first_name: string;
    last_name: string;
  };
  score: number;
  updated_at: string;
  prize_claimed: boolean;
  prize_claimed_at?: string;
  prize?: {
    catalog_item: {
      name: string;
      value: string;
      image_url: string;
    };
  }[];
}

interface WinnersListProps {
  winners: Winner[];
  onClaimPrize?: (winner: Winner) => void;
  showAll?: boolean;
}

const WinnersList: React.FC<WinnersListProps> = ({ winners, onClaimPrize, showAll }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des gagnants</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {winners?.map((winner) => (
            <li key={winner.id}>
              {winner.participants.first_name} {winner.participants.last_name} - Score: {winner.score}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default WinnersList;