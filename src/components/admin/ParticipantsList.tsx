import { useQuery } from "@tanstack/react-query";
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

interface ParticipantsListProps {
  contestId: string;
}

const ParticipantsList = ({ contestId }: ParticipantsListProps) => {
  const { data: participants, isLoading } = useQuery({
    queryKey: ['participants', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participants')
        .select(`
          *,
          participant_answers (
            question_id,
            answer
          )
        `)
        .eq('contest_id', contestId);
      
      if (error) throw error;
      return data;
    }
  });

  const exportToCSV = () => {
    if (!participants) return;

    const headers = ["Prénom", "Nom", "Email", "Score", "Statut"];
    const csvContent = [
      headers.join(","),
      ...participants.map(p => 
        [p.first_name, p.last_name, p.email, p.score || "N/A", p.status].join(",")
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

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={exportToCSV}>
          Exporter en CSV
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Prénom</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants?.map((participant) => (
            <TableRow key={participant.id}>
              <TableCell>{participant.first_name}</TableCell>
              <TableCell>{participant.last_name}</TableCell>
              <TableCell>{participant.email}</TableCell>
              <TableCell>{participant.score || "N/A"}</TableCell>
              <TableCell>{participant.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ParticipantsList;