import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import ContestHeader from "@/components/contest/ContestHeader";
import ContestGeneralStats from "@/components/contest/ContestGeneralStats";
import ContestPrizes from "@/components/contest/ContestPrizes";
import QuestionnaireComponent from "@/components/QuestionnaireComponent";

const Contest = () => {
  const { id } = useParams();

  const { data: contest, isLoading } = useQuery({
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!contest) {
    return <div>Contest not found</div>;
  }

  return (
    <div className="space-y-8">
      <ContestHeader contest={contest} />
      <ContestGeneralStats contestId={contest.id} />
      <ContestPrizes contestId={contest.id} />
      <QuestionnaireComponent contestId={contest.id} />
    </div>
  );
};

export default Contest;