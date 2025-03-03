
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserFilterProps {
  displayMode: 'all' | 'top10' | 'top25';
  onDisplayModeChange: (value: 'all' | 'top10' | 'top25') => void;
}

const UserFilter = ({ displayMode, onDisplayModeChange }: UserFilterProps) => {
  return (
    <Select
      value={displayMode}
      onValueChange={(value: 'all' | 'top10' | 'top25') => onDisplayModeChange(value)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Afficher..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tous les joueurs</SelectItem>
        <SelectItem value="top10">Top 10 🏆</SelectItem>
        <SelectItem value="top25">Top 25 🔥</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default UserFilter;
