import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
  onStatusUpdate,
}: ContestCardTogglesProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <Switch
          id={`featured-${contestId}`}
          checked={isFeatured}
          onCheckedChange={(checked) => onFeatureToggle(contestId, checked)}
        />
        <Label htmlFor={`featured-${contestId}`}>Mettre en avant</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id={`new-${contestId}`}
          checked={isNew}
          onCheckedChange={(checked) => 
            onStatusUpdate(contestId, { is_new: checked })
          }
        />
        <Label htmlFor={`new-${contestId}`}>Marquer comme nouveau</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id={`prizes-${contestId}`}
          checked={hasBigPrizes}
          onCheckedChange={(checked) =>
            onStatusUpdate(contestId, { has_big_prizes: checked })
          }
        />
        <Label htmlFor={`prizes-${contestId}`}>Gros lots</Label>
      </div>
    </div>
  );
};

export default ContestCardToggles;