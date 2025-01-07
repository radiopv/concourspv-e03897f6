import React from 'react';
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomBadge } from "@/components/ui/custom-badge";
import { useContestParticipations } from "@/hooks/useContestParticipations";

interface ContestParticipantsDialogProps {
  contestId: string;
}

const ContestParticipantsDialog = ({ contestId }: ContestParticipantsDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const { data: participations } = useContestParticipations(contestId, open);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setOpen(true)}
        >
          <Users className="w-4 h-4 mr-2" />
          Voir les participants ({participations?.length || 0})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Participants au concours</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prénom</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date de participation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participations?.map((participation) => (
              <TableRow key={participation.id}>
                <TableCell>{participation.participant.first_name}</TableCell>
                <TableCell>{participation.participant.last_name}</TableCell>
                <TableCell>{participation.score}%</TableCell>
                <TableCell>
                  <CustomBadge variant={participation.status === 'winner' ? "success" : "secondary"}>
                    {participation.status === 'winner' ? 'Gagnant' : 'Participant'}
                  </CustomBadge>
                </TableCell>
                <TableCell>
                  {participation.completed_at
                    ? format(new Date(participation.completed_at), 'dd MMMM yyyy', { locale: fr })
                    : 'Non complété'
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default ContestParticipantsDialog;