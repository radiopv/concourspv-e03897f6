import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import ContestDetails from "@/components/contests/ContestDetails";
import ContestStats from "@/components/contests/ContestStats";
import ParticipantsList from "@/components/admin/ParticipantsList";
import DrawManager from "@/components/admin/DrawManager";
import WinnerClaimDialog from "@/components/winners/WinnerClaimDialog";

const Contest = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: contest, isLoading, error } = useQuery({
    queryKey: ['contest', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading contest: {error.message}</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{contest.title}</h1>
      <ContestDetails contest={contest} />
      <ContestStats contestId={contest.id} />
      <ParticipantsList contestId={contest.id} />
      <DrawManager contestId={contest.id} />
      <WinnerClaimDialog winner={contest.winner} open={!!contest.winner} onClose={() => {}} />
    </div>
  );
};

export default Contest;
