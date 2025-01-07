import { useQuery } from "@tanstack/react-query";
import { supabase } from "../App";
import { Trophy } from "lucide-react";
import WinnersList from "@/components/winners/WinnersList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WinnerClaimDialog from "@/components/winners/WinnerClaimDialog";
import { useState } from "react";
import { Contest, Participant } from "@/types/contest";

const Winners = () => {
  const [selectedWinner, setSelectedWinner] = useState<Participant | null>(null);

  const { data: contests, isLoading } = useQuery({
    queryKey: ['contests-with-winners'],
    queryFn: async () => {
      console.log('Fetching contests with winners...');
      const { data: contestsData, error: contestsError } = await supabase
        .from('contests')
        .select(`
          id,
          title,
          description,
          is_new,
          has_big_prizes,
          status,
          participations!inner (
            id,
            score,
            status,
            created_at,
            participant:participants (
              id,
              first_name,
              last_name,
              email
            ),
            participant_prizes (
              prize:prizes (
                catalog_item:prize_catalog (
                  id,
                  name,
                  value,
                  image_url
                )
              )
            )
          )
        `)
        .eq('participations.status', 'winner');

      if (contestsError) {
        console.error('Error fetching contests:', contestsError);
        throw contestsError;
      }

      return contestsData.map((contest: any) => ({
        id: contest.id,
        title: contest.title,
        description: contest.description,
        is_new: contest.is_new,
        has_big_prizes: contest.has_big_prizes,
        status: contest.status,
        participants: contest.participations.map((p: any) => ({
          id: p.participant.id,
          first_name: p.participant.first_name,
          last_name: p.participant.last_name,
          email: p.participant.email,
          score: p.score,
          status: p.status,
          created_at: p.created_at,
          prizes: p.participant_prizes?.map((pp: any) => ({
            catalog_item: pp.prize.catalog_item
          })) || []
        }))
      }));
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