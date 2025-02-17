
import { Badge } from "@/components/ui/badge";

interface ContestCardBadgesProps {
  isNew: boolean;
  hasBigPrizes: boolean;
  isFeatured: boolean;
  isExclusive: boolean;
  isLimited: boolean;
  isVip: boolean;
}

const ContestCardBadges = ({ 
  isNew, 
  hasBigPrizes, 
  isFeatured,
  isExclusive,
  isLimited,
  isVip 
}: ContestCardBadgesProps) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {isNew && (
        <Badge variant="secondary" className="bg-blue-500 text-white">
          Nouveau
        </Badge>
      )}
      {hasBigPrizes && (
        <Badge variant="secondary" className="bg-amber-500 text-white">
          Gros lots
        </Badge>
      )}
      {isFeatured && (
        <Badge variant="secondary" className="bg-purple-500 text-white">
          En vedette
        </Badge>
      )}
      {isExclusive && (
        <Badge variant="secondary" className="bg-green-500 text-white">
          Exclusif
        </Badge>
      )}
      {isLimited && (
        <Badge variant="secondary" className="bg-red-500 text-white">
          Limité
        </Badge>
      )}
      {isVip && (
        <Badge variant="secondary" className="bg-yellow-500 text-white">
          VIP
        </Badge>
      )}
    </div>
  );
};

export default ContestCardBadges;
