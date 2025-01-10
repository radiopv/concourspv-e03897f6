import React, { useState } from "react";
import ContestListHeader from "./contest-list/ContestListHeader";
import ContestListGrid from "./contest-list/ContestListGrid";
import { Contest } from "@/types/contest";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ContestListProps {
  contests: Contest[];
  onSelectContest: (id: string) => void;
}

const ContestList: React.FC<ContestListProps> = ({ contests, onSelectContest }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredContests = contests.filter(contest => {
    if (selectedStatus === "all") return true;
    return contest.status === selectedStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <ContestListHeader onContestSelect={onSelectContest} />
        <Select
          value={selectedStatus}
          onValueChange={setSelectedStatus}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les concours</SelectItem>
            <SelectItem value="draft">Brouillons</SelectItem>
            <SelectItem value="active">Actifs</SelectItem>
            <SelectItem value="archived">Archivés</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ContestListGrid contests={filteredContests} onSelectContest={onSelectContest} />
    </div>
  );
};

export default ContestList;