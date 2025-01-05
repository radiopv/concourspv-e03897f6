import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Trophy, Award } from "lucide-react";
import { CustomBadge } from "@/components/ui/custom-badge";
import { ParticipantEditDialog } from "./ParticipantEditDialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../App";

interface ParticipantsTableProps {
  participants: any[];
  title: string;
  onDelete: (id: string) => void;
}

export const ParticipantsTable = ({ participants, title, onDelete }: ParticipantsTableProps) => {
  // Récupérer l'historique des participations pour chaque participant
  const { data: participationHistory } = useQuery({
    queryKey: ['participation-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participants')
        .select(`
          id,
          contest_id,
          status,
          prizes (
            id,
            catalog_item (
              name,
              value
            )
          )
        `);
      
      if (error) {
        console.error('Error fetching participation history:', error);
        throw error;
      }

      // Organiser les données par participant
      const history = data.reduce((acc: any, curr: any) => {
        if (!acc[curr.id]) {
          acc[curr.id] = {
            totalContests: 0,
            wonPrizes: [],
          };
        }
        acc[curr.id].totalContests++;
        if (curr.status === 'WINNER' && curr.prizes?.length > 0) {
          curr.prizes.forEach((prize: any) => {
            if (prize.catalog_item) {
              acc[curr.id].wonPrizes.push(prize.catalog_item);
            }
          });
        }
        return acc;
      }, {});

      return history;
    }
  });

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
            <TableHead>Participations</TableHead>
            <TableHead>Prix Gagnés</TableHead>
            <TableHead>Date de participation</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.map((participant) => {
            const history = participationHistory?.[participant.id] || { totalContests: 0, wonPrizes: [] };
            
            return (
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
                  <CustomBadge variant={participant.status === 'WINNER' ? "success" : "secondary"}>
                    {participant.status === 'WINNER' ? 'Gagnant' : 'Participant'}
                  </CustomBadge>
                </TableCell>
                <TableCell>
                  <HoverCard>
                    <HoverCardTrigger>
                      <div className="flex items-center gap-1 cursor-help">
                        <Trophy className="w-4 h-4" />
                        {history.totalContests} concours
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <div className="text-sm">
                        <p className="font-semibold">Historique des participations</p>
                        <p>Total des participations: {history.totalContests}</p>
                        <p>Ratio de victoires: {((history.wonPrizes.length / history.totalContests) * 100).toFixed(1)}%</p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell>
                  {history.wonPrizes.length > 0 ? (
                    <HoverCard>
                      <HoverCardTrigger>
                        <div className="flex items-center gap-1 cursor-help">
                          <Award className="w-4 h-4 text-yellow-500" />
                          {history.wonPrizes.length} prix
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <div className="text-sm space-y-2">
                          <p className="font-semibold">Prix gagnés</p>
                          {history.wonPrizes.map((prize: any, index: number) => (
                            <div key={index} className="flex justify-between">
                              <span>{prize.name}</span>
                              <span className="text-green-600">{prize.value}€</span>
                            </div>
                          ))}
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ) : (
                    <span className="text-gray-500 text-sm">Aucun prix</span>
                  )}
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
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};