import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../App";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParticipantsTable } from "./participants/ParticipantsTable";
import { ParticipantsActions } from "./participants/ParticipantsActions";
import { useParams } from "react-router-dom";

interface Participant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  score: number;
  status: string;
  participant_answers?: Array<{
    question_id: string;
    answer: string;
    questions?: {
      correct_answer: string;
    };
  }>;
}

const ParticipantsList = () => {
  const { contestId } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  if (!contestId) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Aucun concours sélectionné</p>
      </div>
    );
  }

  const { data: participants, isLoading } = useQuery({
    queryKey: ['participants', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participations')
        .select(`
          id,
          score,
          status,
          participants (
            id,
            first_name,
            last_name,
            email
          ),
          participant_answers (
            question_id,
            answer,
            questions (
              correct_answer
            )
          )
        `)
        .eq('contest_id', contestId);
      
      if (error) throw error;

      // Transform the data to match the expected format
      const transformedData = data?.map(participation => ({
        id: participation.participants.id,
        first_name: participation.participants.first_name,
        last_name: participation.participants.last_name,
        email: participation.participants.email,
        score: participation.score,
        status: participation.status,
        participant_answers: participation.participant_answers
      })) as Participant[];

      return transformedData || [];
    }
  });

  const deleteParticipantMutation = useMutation({
    mutationFn: async (participantId: string) => {
      // First delete from participations
      const { error: participationsError } = await supabase
        .from('participations')
        .delete()
        .eq('participant_id', participantId)
        .eq('contest_id', contestId);
      
      if (participationsError) throw participationsError;

      // Then delete the participant
      const { error: participantError } = await supabase
        .from('participants')
        .delete()
        .eq('id', participantId);
      
      if (participantError) throw participantError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants', contestId] });
      toast({
        title: "Succès",
        description: "Le participant a été supprimé",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le participant",
        variant: "destructive",
      });
    }
  });

  if (isLoading) {
    return <div>Chargement des participants...</div>;
  }

  const eligibleParticipants = participants?.filter(p => p.score >= 70) || [];
  const ineligibleParticipants = participants?.filter(p => p.score < 70) || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Liste des participants</h2>
        <ParticipantsActions 
          participants={participants || []} 
          contestId={contestId} 
        />
      </div>

      <Tabs defaultValue="eligible" className="w-full">
        <TabsList>
          <TabsTrigger value="eligible">
            Participants Éligibles ({eligibleParticipants.length})
          </TabsTrigger>
          <TabsTrigger value="ineligible">
            Participants Non Éligibles ({ineligibleParticipants.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="eligible">
          <ParticipantsTable 
            participants={eligibleParticipants} 
            title="Participants Éligibles (Score ≥ 70%)"
            onDelete={(id) => deleteParticipantMutation.mutate(id)}
          />
        </TabsContent>

        <TabsContent value="ineligible">
          <ParticipantsTable 
            participants={ineligibleParticipants} 
            title="Participants Non Éligibles (Score < 70%)"
            onDelete={(id) => deleteParticipantMutation.mutate(id)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParticipantsList;