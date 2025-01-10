import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Trophy, Star, Flame, Sparkles, Gift, Crown } from 'lucide-react';

interface ContestCardTogglesProps {
  contestId: string;
  isFeatured: boolean;
  isNew: boolean;
  hasBigPrizes: boolean;
  isExclusive: boolean;
  isLimited: boolean;
  isVip: boolean;
  onFeatureToggle: (id: string, featured: boolean) => void;
  onStatusUpdate: (id: string, updates: { 
    is_new?: boolean; 
    has_big_prizes?: boolean;
    is_exclusive?: boolean;
    is_limited?: boolean;
    is_vip?: boolean;
  }) => void;
}

const ContestCardToggles = ({
  contestId,
  isFeatured,
  isNew,
  hasBigPrizes,
  isExclusive,
  isLimited,
  isVip,
  onFeatureToggle,
  onStatusUpdate
}: ContestCardTogglesProps) => {
  return (
    <div className="space-y-2 p-4 glass-card rounded-xl">
      <div className="flex items-center justify-between">
        <label htmlFor={`featured-${contestId}`} className="text-sm font-medium flex items-center gap-2">
          <Gift className="w-4 h-4 text-emerald-500" />
          Afficher en vedette
        </label>
        <Switch
          id={`featured-${contestId}`}
          checked={isFeatured}
          onCheckedChange={(checked) => onFeatureToggle(contestId, checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor={`new-${contestId}`} className="text-sm font-medium flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500" />
          Marquer comme nouveau
        </label>
        <Switch
          id={`new-${contestId}`}
          checked={isNew}
          onCheckedChange={(checked) => onStatusUpdate(contestId, { is_new: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor={`prizes-${contestId}`} className="text-sm font-medium flex items-center gap-2">
          <Trophy className="w-4 h-4 text-rose-500" />
          Gros lots à gagner
        </label>
        <Switch
          id={`prizes-${contestId}`}
          checked={hasBigPrizes}
          onCheckedChange={(checked) => onStatusUpdate(contestId, { has_big_prizes: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor={`exclusive-${contestId}`} className="text-sm font-medium flex items-center gap-2">
          <Crown className="w-4 h-4 text-purple-500" />
          Concours exclusif
        </label>
        <Switch
          id={`exclusive-${contestId}`}
          checked={isExclusive}
          onCheckedChange={(checked) => onStatusUpdate(contestId, { is_exclusive: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor={`limited-${contestId}`} className="text-sm font-medium flex items-center gap-2">
          <Flame className="w-4 h-4 text-red-500" />
          Édition limitée
        </label>
        <Switch
          id={`limited-${contestId}`}
          checked={isLimited}
          onCheckedChange={(checked) => onStatusUpdate(contestId, { is_limited: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor={`vip-${contestId}`} className="text-sm font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          Accès VIP
        </label>
        <Switch
          id={`vip-${contestId}`}
          checked={isVip}
          onCheckedChange={(checked) => onStatusUpdate(contestId, { is_vip: checked })}
        />
      </div>
    </div>
  );
};

export default ContestCardToggles;