
import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import ContestList from "./ContestList";
import ParticipantsList from "./ParticipantsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { localData } from "@/lib/localData";

const AdminDashboard = () => {
  const [selectedContestId, setSelectedContestId] = useState<string | null>(null);
  const { data: contests, isLoading } = useQuery({
    queryKey: ['admin-contests'],
    queryFn: async () => {
      // Récupérer tous les concours, pas seulement les actifs
      try {
        const allContests = await localData.contests.getAllContests();
        
        console.log('Admin dashboard - fetched contests:', allContests);
        
        return allContests.map(contest => ({
          ...contest,
          participants: { count: contest.participants?.count || 0 },
          questions: { count: contest.questions?.count || 0 }
        }));
      } catch (error) {
        console.error('Error fetching all contests for admin:', error);
        return [];
      }
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
            contests={contests || []} 
            onSelectContest={setSelectedContestId}
          />
          {selectedContestId && <ParticipantsList contestId={selectedContestId} />}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
