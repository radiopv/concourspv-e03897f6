import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import ContestStats from "@/components/contests/ContestStats";
import Winners from "@/components/winners/Winners";

const StatsAndWinnersSection = () => {
  const { data: contests } = useQuery({
    queryKey: ['contests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6">Statistiques des Concours</h2>
      {contests?.map((contest) => (
        <div key={contest.id} className="mb-6">
          <h3 className="text-xl font-semibold">{contest.title}</h3>
          <ContestStats contestId={contest.id} />
        </div>
      ))}
      <Winners />
    </div>
  );
};

export default StatsAndWinnersSection;
