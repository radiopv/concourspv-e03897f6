import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Award, Bell, Flag } from "lucide-react";

interface ContestCardBadgesProps {
  isNew: boolean;
  isExpiringSoon: boolean;
  hasBigPrizes: boolean;
}

const ContestCardBadges = ({ isNew, isExpiringSoon, hasBigPrizes }: ContestCardBadgesProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {isNew && (
        <Badge variant="secondary" className="flex items-center gap-1 bg-blue-500 text-white hover:bg-blue-600">
          <Flag className="h-3 w-3" /> Nouveau
        </Badge>
      )}
      {isExpiringSoon && (
        <Badge variant="destructive" className="flex items-center gap-1">
          <Bell className="h-3 w-3" /> Expire bientôt
        </Badge>
      )}
      {hasBigPrizes && (
        <Badge variant="default" className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600">
          <Award className="h-3 w-3" /> Gros lots
        </Badge>
      )}
    </div>
  );
};

export default ContestCardBadges;