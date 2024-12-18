import React from 'react';
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

const ContestStats = ({ contestId }: { contestId: string }) => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['contest-stats', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contest_stats')
        .select('*')
        .eq('contest_id', contestId);

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return <div>Loading stats...</div>;
  if (error) return <div>Error loading stats: {error.message}</div>;

  return (
    <div>
      <h2>Contest Statistics</h2>
      <ul>
        {stats.map(stat => (
          <li key={stat.id}>
            {stat.participant_name}: {stat.score} points
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContestStats;
