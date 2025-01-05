import { useQuery } from "@tanstack/react-query";
import { supabase } from "../App";
import { Trophy } from "lucide-react";
import WinnersList from "@/components/winners/WinnersList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WinnerClaimDialog from "@/components/winners/WinnerClaimDialog";
import { useState } from "react";

const Winners = () => {
  const [selectedWinner, setSelectedWinner] = useState<any>(null);

  const { data: contests, isLoading } = useQuery({
    queryKey: ['contests-with-winners'],
    queryFn: async () => {
      const { data: contestsData, error: contestsError } = await supabase
        .from('contests')
        .select('*')
        .order('created_at', { ascending: false });

      if (contestsError) throw contestsError;

      const contestsWithWinners = await Promise.all(
        contestsData.map(async (contest) => {
          const { data: winners, error: winnersError } = await supabase
            .from('participants')
            .select(`
              *,
              prize:prizes(
                catalog_item:prize_catalog(*)
              )
            `)
            .eq('contest_id', contest.id)
            .eq('status', 'winner');

          if (winnersError) throw winnersError;

          return {
            ...contest,
            participants: winners
          };
        })
      );

      return contestsWithWinners;
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-8 h-8 text-amber-500" />
          <h1 className="text-3xl font-bold">Chargement des gagnants...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-8 h-8 text-amber-500" />
        <h1 className="text-3xl font-bold">Tableau des Gagnants</h1>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Tous les gagnants</TabsTrigger>
          <TabsTrigger value="unclaimed">Prix à réclamer</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <WinnersList 
            contests={contests || []} 
            onClaimPrize={setSelectedWinner}
            showAll={true}
          />
        </TabsContent>

        <TabsContent value="unclaimed">
          <WinnersList 
            contests={contests || []} 
            onClaimPrize={setSelectedWinner}
            showAll={false}
          />
        </TabsContent>
      </Tabs>

      <WinnerClaimDialog
        winner={selectedWinner}
        open={!!selectedWinner}
        onClose={() => setSelectedWinner(null)}
      />
    </div>
  );
};

export default Winners;