import React from "react";
import ContestCard from "../ContestCard";

interface ContestListGridProps {
  contests: any[];
  onSelectContest: (id: string) => void;
}

const ContestListGrid: React.FC<ContestListGridProps> = ({ contests, onSelectContest }) => {
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
          onSelect={() => onSelectContest(contest.id)}
        />
      ))}
    </div>
  );
};

export default ContestListGrid;