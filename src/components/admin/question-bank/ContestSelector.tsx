import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ContestSelectorProps {
  contests?: Array<{ id: string; title: string; }>;
  selectedContestId: string;
  selectedQuestionsCount: number;
  onContestSelect: (value: string) => void;
  onAddToContest: () => void;
}

export const ContestSelector = ({
  contests,
  selectedContestId,
  selectedQuestionsCount,
  onContestSelect,
  onAddToContest
}: ContestSelectorProps) => {
  return (
    <div className="flex gap-4 items-center mb-6">
      <Select value={selectedContestId} onValueChange={onContestSelect}>
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Sélectionner un concours" />
        </SelectTrigger>
        <SelectContent>
          {contests?.map((contest) => (
            <SelectItem key={contest.id} value={contest.id}>
              {contest.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button 
        onClick={onAddToContest}
        disabled={!selectedContestId || selectedQuestionsCount === 0}
      >
        Ajouter au concours ({selectedQuestionsCount} sélectionnée{selectedQuestionsCount > 1 ? 's' : ''})
      </Button>
    </div>
  );
};