import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../App";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomBadge } from "@/components/ui/custom-badge";

interface ParticipantsListProps {
  contestId: string;
}

const ParticipantsList = ({ contestId }: ParticipantsListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

      // Calculate scores for each participant
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
    }
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

  const ParticipantsTable = ({ participants, title }: { participants: any[], title: string }) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <CustomBadge variant={title.includes("Éligibles") ? "success" : "secondary"}>
          {participants.length} participants
        </CustomBadge>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Prénom</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date de participation</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.map((participant) => (
            <TableRow key={participant.id}>
              <TableCell>{participant.first_name}</TableCell>
              <TableCell>{participant.last_name}</TableCell>
              <TableCell>{participant.email}</TableCell>
              <TableCell>
                <CustomBadge variant={participant.score >= 70 ? "success" : "destructive"}>
                  {participant.score}%
                </CustomBadge>
              </TableCell>
              <TableCell>
                <CustomBadge variant={participant.status === 'winner' ? "success" : "secondary"}>
                  {participant.status === 'winner' ? 'Gagnant' : 'Participant'}
                </CustomBadge>
              </TableCell>
              <TableCell>
                {participant.completed_at 
                  ? new Date(participant.completed_at).toLocaleDateString('fr-FR')
                  : "N/A"
                }
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteParticipantMutation.mutate(participant.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Liste des participants</h2>
        <Button onClick={exportToCSV} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exporter en CSV
        </Button>
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
          />
        </TabsContent>

        <TabsContent value="ineligible">
          <ParticipantsTable 
            participants={ineligibleParticipants} 
            title="Participants Non Éligibles (Score < 70%)" 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParticipantsList;