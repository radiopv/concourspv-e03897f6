import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import ContestList from "./ContestList";
import ParticipantsList from "./ParticipantsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard = () => {
  const [selectedContestId, setSelectedContestId] = useState<string | null>(null);
  const { data: contests, isLoading } = useQuery({
    queryKey: ['admin-contests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          participants:participants(count),
          questions:questions(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data.map(contest => ({
        ...contest,
        participants: { count: contest.participants?.[0]?.count || 0 },
        questions: { count: contest.questions?.[0]?.count || 0 }
      }));
    }
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Concours</CardTitle>
        </CardHeader>
        <CardContent>
          <ContestList 
            contests={contests} 
            onSelectContest={setSelectedContestId}
          />
          {selectedContestId && <ParticipantsList contestId={selectedContestId} />}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;