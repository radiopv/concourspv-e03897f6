import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ParticipantsList = ({ contestId }: { contestId: string }) => {
  const { toast } = useToast();

  const { data: participants, isLoading, isError } = useQuery({
    queryKey: ['participants', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('contest_id', contestId);

      if (error) {
        console.error('Error fetching participants:', error);
        throw error;
      }
      return data;
    }
  });

  if (isLoading) return <div>Loading participants...</div>;
  if (isError) return <div>Error loading participants.</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Participants</CardTitle>
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

export default ParticipantsList;
