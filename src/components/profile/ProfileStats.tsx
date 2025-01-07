import React from 'react';
import { Label } from "@/components/ui/label";

interface ProfileStatsProps {
  total_points?: number;
  contests_won?: number;
}

export const ProfileStats = ({ total_points, contests_won }: ProfileStatsProps) => {
  return (
    <div>
      <Label>Statistiques</Label>
      <div className="mt-2 space-y-2">
        <p className="text-sm text-muted-foreground">
          Points totaux: {total_points || 0}
        </p>
        <p className="text-sm text-muted-foreground">
          Concours gagnés: {contests_won || 0}
        </p>
      </div>
    </div>
  );
};