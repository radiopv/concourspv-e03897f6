import React from "react";
import ContestListHeader from "./contest-list/ContestListHeader";
import ContestListGrid from "./contest-list/ContestListGrid";

interface ContestListProps {
  contests: any[];
  onSelectContest: (id: string) => void;
}

const ContestList: React.FC<ContestListProps> = ({ contests, onSelectContest }) => {
  return (
    <div className="space-y-6">
      <ContestListHeader onContestSelect={onSelectContest} />
      <ContestListGrid contests={contests} onSelectContest={onSelectContest} />
    </div>
  );
};

export default ContestList;