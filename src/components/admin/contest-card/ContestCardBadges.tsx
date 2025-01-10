interface ContestCardBadgesProps {
  isNew: boolean;
  hasBigPrizes: boolean;
  isFeatured: boolean;
}

const ContestCardBadges = ({ isNew, hasBigPrizes, isFeatured }: ContestCardBadgesProps) => {
  return (
    <div className="flex gap-2">
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
    </div>
  );
};

export default ContestCardBadges;