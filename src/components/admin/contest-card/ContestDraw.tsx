import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../App";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

interface ContestDrawProps {
  contestId: string;
  onDrawWinner: () => void;
}

const ContestDraw = ({ contestId, onDrawWinner }: ContestDrawProps) => {
  const { data: winners, isLoading } = useQuery({
    queryKey: ['contest-winners', contestId],
    queryFn: async () => {
      console.log('Fetching winners for contest:', contestId);
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('contest_id', contestId)
        .eq('status', 'winner');

      if (error) {
        console.error('Error fetching winners:', error);
        throw error;
      }

      console.log('Winners data:', data);
      return data;
    }
  });

  if (isLoading) {
    return <div>Chargement des gagnants...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tirage au sort</h3>
        <Button
          onClick={onDrawWinner}
          className="flex items-center gap-2"
          variant="outline"
          disabled={winners && winners.length > 0}
        >
          <Trophy className="w-4 h-4" />
          {winners && winners.length > 0 ? 'Gagnant tiré' : 'Tirer au sort'}
        </Button>
      </div>

      {winners && winners.length > 0 && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800">Gagnant(s)</h4>
          <ul className="mt-2 space-y-2">
            {winners.map((winner) => (
              <li key={winner.id} className="text-green-700">
                {winner.first_name} {winner.last_name} ({winner.email})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ContestDraw;