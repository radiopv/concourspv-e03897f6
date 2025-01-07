import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../App";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParticipantsTable } from "./participants/ParticipantsTable";
import { ParticipantsActions } from "./participants/ParticipantsActions";
import { useParams } from "react-router-dom";

interface Participant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface ParticipationResponse {
  id: string;
  score: number;
  status: string;
  participant: Participant;
  participant_answers: Array<{
    question_id: string;
    answer: string;
    questions: {
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

  const { data: participations = [], isLoading } = useQuery({
    queryKey: ['participants', contestId],
    queryFn: async () => {
      console.log('Fetching participants for contest:', contestId);
      
      const { data, error } = await supabase
        .from('participations')
        .select(`
          id,
          score,
          status,
          participant:participants!inner (
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

      if (error) {
        console.error('Error fetching participants:', error);
        throw error;
      }

      return (data || []).map((item): ParticipationResponse => ({
        id: item.id,
        score: item.score,
        status: item.status,
        participant: {
          id: item.participant.id,
          first_name: item.participant.first_name,
          last_name: item.participant.last_name,
          email: item.participant.email
        },
        participant_answers: (item.participant_answers || []).map(answer => ({
          question_id: answer.question_id,
          answer: answer.answer,
          questions: {
            correct_answer: answer.questions?.correct_answer || ''
          }
        }))
      }));
    }
  });

  const deleteParticipantMutation = useMutation({
    mutationFn: async (participantId: string) => {
      console.log('Deleting participant:', participantId);
      
      const { error: participationsError } = await supabase
        .from('participations')
        .delete()
        .eq('participant_id', participantId)
        .eq('contest_id', contestId);
      
      if (participationsError) throw participationsError;

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
    onError: (error) => {
      console.error('Error deleting participant:', error);
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

  const eligibleParticipants = participations.filter(p => p.score >= 70);
  const ineligibleParticipants = participations.filter(p => p.score < 70);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Liste des participants</h2>
        <ParticipantsActions 
          participants={participations} 
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
