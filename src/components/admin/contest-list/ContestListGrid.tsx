import React from "react";
import ContestCard from "../ContestCard";
import { useContestMutations } from "../hooks/useContestMutations";
import { Contest } from "@/types/contest";

interface ContestListGridProps {
  contests: Contest[];
  onSelectContest: (id: string) => void;
}

const ContestListGrid: React.FC<ContestListGridProps> = ({ contests, onSelectContest }) => {
  const { 
    deleteMutation,
    archiveMutation,
    featureToggleMutation,
    statusUpdateMutation 
  } = useContestMutations();

  if (!contests || contests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucun concours trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contests.map((contest) => (
        <ContestCard
          key={contest.id}
          contest={contest}
          onEdit={onSelectContest}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      ))}
    </div>
  );
};

export default ContestListGrid;