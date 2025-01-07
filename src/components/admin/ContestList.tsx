import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContestMutations } from './hooks/useContestMutations';
import { useContestQueries } from './hooks/useContestQueries';
import ContestCard from './ContestCard';
import ContestListHeader from './contest-list/ContestListHeader';
import { Skeleton } from "@/components/ui/skeleton";

const ContestList = () => {
  const navigate = useNavigate();
  const { contestsWithCounts, isLoading, error } = useContestQueries();
  const { 
    deleteMutation,
    archiveMutation,
    featureToggleMutation,
    statusUpdateMutation 
  } = useContestMutations();

  const handleDelete = (id: string) => {
    console.log('Deleting contest:', id);
    deleteMutation.mutate(id);
  };

  const handleArchive = (id: string) => {
    console.log('Archiving contest:', id);
    archiveMutation.mutate(id);
  };

  const handleFeatureToggle = (id: string, featured: boolean) => {
    console.log('Toggling feature status:', { id, featured });
    featureToggleMutation.mutate({ id, featured });
  };

  const handleStatusUpdate = (id: string, updates: any) => {
    console.log('Updating contest status:', { id, updates });
    statusUpdateMutation.mutate({ id, updates });
  };

  const handleSelect = (id: string) => {
    console.log('Selecting contest:', id);
    navigate(`/admin/contests/${id}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <ContestListHeader />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[300px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Une erreur est survenue lors du chargement des concours.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ContestListHeader />
      
      {contestsWithCounts?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucun concours n'a été créé.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contestsWithCounts?.map((contest) => (
            <ContestCard
              key={contest.id}
              contest={contest}
              onDelete={handleDelete}
              onArchive={handleArchive}
              onFeatureToggle={handleFeatureToggle}
              onStatusUpdate={handleStatusUpdate}
              onSelect={handleSelect}
              onEdit={handleSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContestList;