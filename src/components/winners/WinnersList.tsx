import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

interface Winner {
  first_name: string;
  last_name: string;
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

const WinnersList = () => {
  const { data: winners, isLoading } = useQuery({
    queryKey: ['winners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('winners')
        .select(`
          *,
          participants (
            first_name,
            last_name
          )
        `);

      if (error) throw error;
      return data as Winner[];
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Winners List</CardTitle>
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
