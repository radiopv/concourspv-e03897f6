
import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import ContestList from "./ContestList";
import ParticipantsList from "./ParticipantsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { localData } from "@/lib/data";
import { Contest } from "@/types/contest";
import { Skeleton } from "@/components/ui/skeleton";

const AdminDashboard = () => {
  const [selectedContestId, setSelectedContestId] = useState<string | null>(null);
  const { data: contests, isLoading, error } = useQuery({
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
        })) as Contest[];
      } catch (error) {
        console.error('Error fetching all contests for admin:', error);
        throw error;
      }
    },
    staleTime: 30000, // 30 secondes
    retry: 2
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
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

const LoadingSkeleton = () => (
  <div className="space-y-6 p-6">
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </CardContent>
    </Card>
  </div>
);

const ErrorDisplay = ({ error }: { error: any }) => (
  <div className="p-6">
    <Card className="border-red-300 bg-red-50">
      <CardHeader>
        <CardTitle className="text-red-600">Erreur lors du chargement</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-red-500">
          {error instanceof Error ? error.message : "Une erreur est survenue lors du chargement des données."}
        </p>
      </CardContent>
    </Card>
  </div>
);

export default AdminDashboard;
