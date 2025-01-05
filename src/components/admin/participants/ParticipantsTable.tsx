import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { CustomBadge } from "@/components/ui/custom-badge";
import { ParticipantEditDialog } from "./ParticipantEditDialog";

interface ParticipantsTableProps {
  participants: any[];
  title: string;
  onDelete: (id: string) => void;
}

export const ParticipantsTable = ({ participants, title, onDelete }: ParticipantsTableProps) => {
  return (
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
                <div className="flex gap-2">
                  <ParticipantEditDialog participant={participant} />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(participant.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};