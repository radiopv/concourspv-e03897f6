import React from 'react';
import { supabase } from "@/lib/supabase";

const WinnerDisplay = ({ contestId }: { contestId: string }) => {
  const [winners, setWinners] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchWinners = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('winners')
        .select('*')
        .eq('contest_id', contestId);

      if (error) {
        console.error('Error fetching winners:', error);
      } else {
        setWinners(data);
      }
      setLoading(false);
    };

    fetchWinners();
  }, [contestId]);

  if (loading) {
    return <div>Loading winners...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold">Winners</h2>
      {winners.length > 0 ? (
        <ul>
          {winners.map((winner) => (
            <li key={winner.id}>
              {winner.name} - {winner.prize}
            </li>
          ))}
        </ul>
      ) : (
        <p>No winners yet.</p>
      )}
    </div>
  );
};

export default WinnerDisplay;
