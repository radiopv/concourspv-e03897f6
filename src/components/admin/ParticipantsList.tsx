import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../App";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParticipantsTable } from "./participants/ParticipantsTable";
import { ParticipantsActions } from "./participants/ParticipantsActions";
import { useParams } from "react-router-dom";

interface Question {
  correct_answer: string;
}

interface ParticipantAnswer {
  question_id: string;
  answer: string;
  questions?: Question;
}

interface Participant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  score: number;
  status: string;
  participant_answers?: ParticipantAnswer[];
}

interface ParticipationResponse {
  id: string;
  score: number;
  status: string;
  participant: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  participant_answers: Array<{
    question_id: string;
    answer: string;
    questions: Question | null;
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

      if (!data) return [];

      return (data as ParticipationResponse[]).map((participation): Participant => ({
        id: participation.participant.id,
        first_name: participation.participant.first_name,
        last_name: participation.participant.last_name,
        email: participation.participant.email,
        score: participation.score,
        status: participation.status,
        participant_answers: participation.participant_answers.map(answer => ({
          question_id: answer.question_id,
          answer: answer.answer,
          questions: answer.questions || undefined
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