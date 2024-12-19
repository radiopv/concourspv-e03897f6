import React from 'react';
import { Badge } from "@/components/ui/badge";

interface ContestCardBadgesProps {
  isNew: boolean;
  isExpiringSoon: boolean;
  hasBigPrizes: boolean;
}

const ContestCardBadges = ({
  isNew,
  isExpiringSoon,
  hasBigPrizes,
}: ContestCardBadgesProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {isNew && (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          Nouveau
        </Badge>
      )}
      {isExpiringSoon && (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          Se termine bientôt
        </Badge>
      )}
      {hasBigPrizes && (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Gros lots
        </Badge>
      )}
    </div>
  );
};

export default ContestCardBadges;