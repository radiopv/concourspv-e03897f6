import React from 'react';
import { Switch } from "@/components/ui/switch";

interface ContestCardTogglesProps {
  contestId: string;
  isFeatured: boolean;
  isNew: boolean;
  hasBigPrizes: boolean;
  onFeatureToggle: (id: string, featured: boolean) => void;
  onStatusUpdate: (id: string, updates: { is_new?: boolean; has_big_prizes?: boolean }) => void;
}

const ContestCardToggles = ({
  contestId,
  isFeatured,
  isNew,
  hasBigPrizes,
  onFeatureToggle,
  onStatusUpdate
}: ContestCardTogglesProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={`featured-${contestId}`} className="text-sm font-medium">
          Afficher sur la page d'accueil
        </label>
        <Switch
          id={`featured-${contestId}`}
          checked={isFeatured}
          onCheckedChange={(checked) => onFeatureToggle(contestId, checked)}
        />
      </div>
      <div className="flex items-center justify-between">
        <label htmlFor={`new-${contestId}`} className="text-sm font-medium">
          Marquer comme nouveau
        </label>
        <Switch
          id={`new-${contestId}`}
          checked={isNew}
          onCheckedChange={(checked) => onStatusUpdate(contestId, { is_new: checked })}
        />
      </div>
      <div className="flex items-center justify-between">
        <label htmlFor={`prizes-${contestId}`} className="text-sm font-medium">
          Gros lots à gagner
        </label>
        <Switch
          id={`prizes-${contestId}`}
          checked={hasBigPrizes}
          onCheckedChange={(checked) => onStatusUpdate(contestId, { has_big_prizes: checked })}
        />
      </div>
    </div>
  );
};

export default ContestCardToggles;