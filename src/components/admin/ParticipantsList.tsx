import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const ParticipantsList = ({ contestId }: { contestId: string }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: participants, isLoading, error } = useQuery({
    queryKey: ['participants', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('contest_id', contestId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const filteredParticipants = participants?.filter(participant =>
    participant.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading participants</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Participants</CardTitle>
      </CardHeader>
      <CardContent>
        <input
          type="text"
          placeholder="Search participants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 p-2 border rounded"
        />
        <ul>
          {filteredParticipants?.map(participant => (
            <li key={participant.id} className="py-2 border-b">
              {participant.first_name} {participant.last_name}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ParticipantsList;
