import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Participant {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  score: number;
  status: string;
}

interface EligibleParticipantsListProps {
  participants: Participant[];
  onSelectWinner: (participant: Participant) => Promise<void>;
  isDrawing: boolean;
}

export const EligibleParticipantsList = ({
  participants,
  onSelectWinner,
  isDrawing
}: EligibleParticipantsListProps) => {
  return (
    <ScrollArea className="h-[300px] rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.map((participant) => (
            <TableRow key={participant.id}>
              <TableCell>
                {participant.first_name} {participant.last_name}
              </TableCell>
              <TableCell>{participant.score}%</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSelectWinner(participant)}
                  disabled={isDrawing}
                >
                  {isDrawing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Sélectionner"
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};