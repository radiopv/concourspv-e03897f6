import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Gift } from "lucide-react";

interface ContestCardPrizeProps {
  contestId: string;
}

const ContestCardPrize = ({ contestId }: ContestCardPrizeProps) => {
  const { data: prizes } = useQuery({
    queryKey: ['contest-prizes', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prizes')
        .select('*')
        .eq('contest_id', contestId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!contestId
  });

  if (!prizes || prizes.length === 0) return null;

  return (
    <div className="flex items-start space-x-2 p-3 bg-purple-50 rounded-lg">
      <Gift className="w-5 h-5 text-purple-600 mt-0.5" />
      <div className="space-y-1">
        <h4 className="font-semibold text-purple-900">Prix à gagner</h4>
        <ul className="space-y-1">
          {prizes.map((prize) => (
            <li key={prize.id} className="text-sm text-purple-700">
              {prize.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContestCardPrize;