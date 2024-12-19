import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../App";
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
}

const ContestParticipants = ({ contestId }: ContestParticipantsProps) => {
  const { data: participants, isLoading } = useQuery({
    queryKey: ['contest-participants', contestId],
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

  if (isLoading) {
    return <div>Chargement des participants...</div>;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Prénom</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Date de participation</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants?.map((participant) => (
            <TableRow key={participant.id}>
              <TableCell>{participant.first_name}</TableCell>
              <TableCell>{participant.last_name}</TableCell>
              <TableCell>{participant.email}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  participant.score >= 70 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {participant.score}%
                </span>
              </TableCell>
              <TableCell>
                {participant.completed_at 
                  ? format(new Date(participant.completed_at), 'dd MMMM yyyy', { locale: fr })
                  : "N/A"
                }
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  participant.status === 'winner' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
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
