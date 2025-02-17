
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ContestParticipantsProps {
  contestId: string;
  onSelectContest: (id: string) => void;
  participantsCount: number;
}

const ContestParticipants = ({ contestId, onSelectContest, participantsCount }: ContestParticipantsProps) => {
  const { data: participants, isLoading } = useQuery({
    queryKey: ['contest-participants', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('contest_id', contestId)
        .order('score', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Chargement des participants...</div>;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Date de participation</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants?.map((participant) => (
            <TableRow key={participant.id}>
              <TableCell>{participant.last_name}</TableCell>
              <TableCell>{participant.first_name}</TableCell>
              <TableCell>{participant.email}</TableCell>
              <TableCell>{participant.score}%</TableCell>
              <TableCell>
                {participant.completed_at && format(new Date(participant.completed_at), 'dd MMMM yyyy', { locale: fr })}
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  participant.status === 'winner' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {participant.status === 'winner' ? 'Gagnant' : 'Participant'}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContestParticipants;
