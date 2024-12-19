import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ContestParticipantsProps {
  contestId: string;
}

const ContestParticipants = ({ contestId }: ContestParticipantsProps) => {
  const { toast } = useToast();

  const { data: participants, isLoading, error } = useQuery({
    queryKey: ['participants', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('contest_id', contestId);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les participants.",
          variant: "destructive",
        });
        throw error;
      }
      return data;
    }
  });

  if (isLoading) {
    return <div>Chargement des participants...</div>;
  }

  if (error) {
    return <div>Erreur lors du chargement des participants.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Participants du Concours</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {participants?.map(participant => (
            <li key={participant.id}>
              {participant.first_name} {participant.last_name} - {participant.email}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ContestParticipants;
