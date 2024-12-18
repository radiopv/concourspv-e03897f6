import { useParams } from "react-router-dom";
import ContestGeneralStats from "@/components/contest/ContestGeneralStats";
import TopParticipantsList from "@/components/contest/TopParticipantsList";
import WinnerDisplay from "@/components/contest/WinnerDisplay";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../App";

const ContestStatsPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: participants } = useQuery({
    queryKey: ['contest-participants', id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('contest_id', id)
        .order('score', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (!id) return null;

  // Calculate stats from participants data
  const calculateStats = () => {
    if (!participants) return { averageScore: 0, qualifiedCount: 0, totalParticipants: 0 };

    const totalParticipants = participants.length;
    const scores = participants.map(p => p.score || 0);
    const averageScore = totalParticipants > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / totalParticipants)
      : 0;
    const qualifiedCount = participants.filter(p => (p.score || 0) >= 70).length;

    return {
      averageScore,
      qualifiedCount,
      totalParticipants
    };
  };

  const stats = calculateStats();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <WinnerDisplay contestId={id} />
      <ContestGeneralStats 
        averageScore={stats.averageScore}
        qualifiedCount={stats.qualifiedCount}
        totalParticipants={stats.totalParticipants}
      />
      {participants && <TopParticipantsList participants={participants} />}
    </div>
  );
};

export default ContestStatsPage;