import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import ContestStats from "@/components/contests/ContestStats";

const ContestStatsPage = () => {
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
      <h1 className="text-3xl font-bold">Statistiques du concours</h1>
      <Card className="p-6">
        <ContestStats contestId={contest.id} />
      </Card>
    </div>
  );
};

export default ContestStatsPage;