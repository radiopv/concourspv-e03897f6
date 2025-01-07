import React from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParticipantsTable } from "./participants/ParticipantsTable";
import { ParticipantsActions } from "./participants/ParticipantsActions";
import { useParams } from "react-router-dom";

// Types définis selon la structure Supabase
interface Participant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Question {
  id: string;
  correct_answer: string;
}

interface ParticipantAnswer {
  question_id: string;
  answer: string;
  questions: Question;
}

interface ParticipationResponse {
  id: string;
  participant: Participant;
  score: number | null;
  status: string;
  completed_at?: string;
  participant_answers: ParticipantAnswer[];
}

const ParticipantsList = () => {
  const { contestId } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: participations, isLoading, error } = useQuery({
    queryKey: ['participations', contestId],
    queryFn: async () => {
      if (!contestId) return [];

      const { data, error } = await supabase
        .from('participations')
        .select(`
          id,
          score,
          status,
          completed_at,
          participant:participants (
            id,
            first_name,
            last_name,
            email
          ),
          participant_answers (
            question_id,
            answer,
            questions (
              id,
              correct_answer
            )
          )
        `)
        .eq('contest_id', contestId);

      if (error) {
        console.error('Error fetching participations:', error);
        throw error;
      }

      if (!data) return [];

      return data.map((item): ParticipationResponse => ({
        id: item.id,
        score: item.score,
        status: item.status,
        completed_at: item.completed_at,
        participant: item.participant,
        participant_answers: Array.isArray(item.participant_answers) 
          ? item.participant_answers 
          : []
      }));
    },
    enabled: !!contestId
  });

  const deleteParticipationMutation = useMutation({
    mutationFn: async (participationId: string) => {
      const { error } = await supabase
        .from('participations')
        .delete()
        .eq('id', participationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participations', contestId] });
      toast({
        title: "Succès",
        description: "Le participant a été supprimé",
      });
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le participant",
        variant: "destructive",
      });
    }
  });

  if (isLoading) {
    return <div className="p-8 text-center">Chargement des participants...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Une erreur est survenue lors du chargement des participants
      </div>
    );
  }

  if (!participations || participations.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        Aucun participant pour ce concours
      </div>
    );
  }

  const eligibleParticipants = participations.filter(p => p.score !== null && p.score >= 70);
  const ineligibleParticipants = participations.filter(p => p.score === null || p.score < 70);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Liste des participants</h2>
        <ParticipantsActions 
          participants={participations} 
          contestId={contestId || ''} 
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
            onDelete={(id) => deleteParticipationMutation.mutate(id)}
          />
        </TabsContent>

        <TabsContent value="ineligible">
          <ParticipantsTable 
            participants={ineligibleParticipants} 
            title="Participants Non Éligibles (Score < 70%)"
            onDelete={(id) => deleteParticipationMutation.mutate(id)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParticipantsList;