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

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <WinnerDisplay contestId={id} />
      <ContestGeneralStats contestId={id} />
      {participants && <TopParticipantsList participants={participants} />}
    </div>
  );
};

export default ContestStatsPage;