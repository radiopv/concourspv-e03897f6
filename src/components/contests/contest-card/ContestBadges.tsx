
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";

interface ContestBadgesProps {
  isNew: boolean;
  hasBigPrizes: boolean;
  isRankRestricted: boolean;
  minRank?: string;
  isLocked: boolean;
}

const ContestBadges = ({ isNew, hasBigPrizes, isRankRestricted, minRank, isLocked }: ContestBadgesProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {isNew && (
        <Badge className="bg-[#9b87f5] text-white">
          Nouveau
        </Badge>
      )}
      {hasBigPrizes && (
        <Badge className="bg-[#F97316] text-white">
          Gros Lots
        </Badge>
      )}
      {isRankRestricted && minRank && (
        <Badge className={isLocked ? "bg-red-500 text-white" : "bg-green-500 text-white"}>
          {isLocked ? <Lock className="w-3 h-3 mr-1 inline" /> : null}
          Rang {minRank}
        </Badge>
      )}
    </div>
  );
};

export default ContestBadges;
