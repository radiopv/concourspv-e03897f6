import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../App";

interface ParticipantsActionsProps {
  participants: any[];
  contestId: string;
}

export const ParticipantsActions = ({ participants, contestId }: ParticipantsActionsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  return (
    <div className="flex gap-2">
      <Button onClick={addTestParticipants} variant="outline">
        Ajouter des participants test
      </Button>
      <Button onClick={exportToCSV} className="flex items-center gap-2">
        <Download className="w-4 h-4" />
        Exporter en CSV
      </Button>
    </div>
  );
};