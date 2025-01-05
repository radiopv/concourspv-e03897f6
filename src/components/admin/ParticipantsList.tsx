import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../App";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParticipantsTable } from "./participants/ParticipantsTable";
import { useParams } from "react-router-dom";

const ParticipantsList = () => {
  const { contestId } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Add early return if no contestId is provided
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
        .from('participants')
        .select(`
          *,
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
      console.log("Participants récupérés:", data); // Debug log

      return data.map(participant => {
        if (!participant.participant_answers) {
          return { ...participant, score: 0 };
        }

        const totalQuestions = participant.participant_answers.length;
        const correctAnswers = participant.participant_answers.filter(answer => 
          answer.answer === answer.questions?.correct_answer
        ).length;

        const score = totalQuestions > 0 
          ? Math.round((correctAnswers / totalQuestions) * 100) 
          : 0;

        return { ...participant, score };
      });
    },
    enabled: !!contestId
  });

  const deleteParticipantMutation = useMutation({
    mutationFn: async (participantId: string) => {
      const { error } = await supabase
        .from('participants')
        .delete()
        .eq('id', participantId);
      
      if (error) throw error;
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

  const addTestParticipants = async () => {
    const testParticipants = [
      { first_name: "Alice", last_name: "Test", email: "alice@test.com", score: 45 },
      { first_name: "Bob", last_name: "Test", email: "bob@test.com", score: 60 },
      { first_name: "Charlie", last_name: "Test", email: "charlie@test.com", score: 75 },
      { first_name: "David", last_name: "Test", email: "david@test.com", score: 85 },
      { first_name: "Eve", last_name: "Test", email: "eve@test.com", score: 95 }
    ];

    for (const participant of testParticipants) {
      const { error } = await supabase
        .from('participants')
        .insert([{
          ...participant,
          contest_id: contestId,
          completed_at: new Date().toISOString(),
          status: participant.score >= 70 ? 'eligible' : 'ineligible'
        }]);

      if (error) {
        console.error("Erreur lors de l'ajout d'un participant test:", error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter les participants test",
          variant: "destructive",
        });
        return;
      }
    }

    queryClient.invalidateQueries({ queryKey: ['participants', contestId] });
    toast({
      title: "Succès",
      description: "Les participants test ont été ajoutés",
    });
  };

  const exportToCSV = () => {
    if (!participants) return;

    const headers = ["Prénom", "Nom", "Email", "Score", "Statut", "Éligible", "Date de participation"];
    const csvContent = [
      headers.join(","),
      ...participants.map(p => 
        [
          p.first_name, 
          p.last_name, 
          p.email, 
          `${p.score}%`, 
          p.status || "En attente",
          p.score >= 70 ? "Oui" : "Non",
          p.completed_at ? new Date(p.completed_at).toLocaleDateString('fr-FR') : "N/A"
        ].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "participants.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <div>Chargement des participants...</div>;
  }

  const eligibleParticipants = participants?.filter(p => p.score >= 70) || [];
  const ineligibleParticipants = participants?.filter(p => p.score < 70) || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Liste des participants</h2>
        <div className="flex gap-2">
          <Button onClick={addTestParticipants} variant="outline">
            Ajouter des participants test
          </Button>
          <Button onClick={exportToCSV} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exporter en CSV
          </Button>
        </div>
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