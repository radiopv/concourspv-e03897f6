import { useQuery } from "@tanstack/react-query";
import { supabase } from "../App";
import { Trophy } from "lucide-react";
import WinnersList from "@/components/winners/WinnersList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WinnerClaimDialog from "@/components/winners/WinnerClaimDialog";
import { useState } from "react";
import { Contest, Participant, ParticipantPrize } from "@/types/contest";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const transformParticipantPrizes = (prizes: any[]): ParticipantPrize[] => {
  return prizes?.map((pp: any) => ({
    prize: {
      catalog_item: {
        id: pp.prize.catalog_item.id,
        name: pp.prize.catalog_item.name,
        value: pp.prize.catalog_item.value,
        image_url: pp.prize.catalog_item.image_url
      }
    }
  })) || [];
};

const transformParticipants = (participants: any[]): Participant[] => {
  return participants?.map((participant: any) => ({
    id: participant.id,
    first_name: participant.first_name,
    last_name: participant.last_name,
    score: participant.score,
    status: participant.status,
    created_at: participant.created_at,
    participant_prizes: transformParticipantPrizes(participant.participant_prizes || [])
  })) || [];
};

const Winners = () => {
  const [selectedWinner, setSelectedWinner] = useState<any>(null);

  const { data: contests, isLoading, error } = useQuery<Contest[]>({
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
          participants!inner (
            id,
            first_name,
            last_name,
            score,
            status,
            created_at,
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
        .eq('participants.status', 'winner');

      if (contestsError) {
        console.error('Error fetching contests:', contestsError);
        throw contestsError;
      }

      // Transform the data to match our types
      const transformedData: Contest[] = (contestsData || []).map((contest: any) => ({
        id: contest.id,
        title: contest.title,
        description: contest.description,
        is_new: contest.is_new,
        has_big_prizes: contest.has_big_prizes,
        status: contest.status,
        participants: transformParticipants(contest.participants || [])
      }));

      return transformedData;
    },
    retry: 1,
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: false
  });

  if (error) {
    return (
      <Card className="m-4">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Une erreur est survenue lors du chargement des gagnants.
            <p className="text-sm text-gray-600 mt-2">Veuillez réessayer plus tard.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <h1 className="text-3xl font-bold">Chargement des gagnants...</h1>
        </div>
      </div>
    );
  }

  if (!contests || contests.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-8 h-8 text-amber-500" />
          <h1 className="text-3xl font-bold">Tableau des Gagnants</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Aucun gagnant pour le moment.</p>
          </CardContent>
        </Card>
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
            contests={contests} 
            onClaimPrize={setSelectedWinner}
            showAll={true}
          />
        </TabsContent>

        <TabsContent value="unclaimed">
          <WinnersList 
            contests={contests} 
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