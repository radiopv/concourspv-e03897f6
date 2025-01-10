import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ContestCardHeader from './contest-card/ContestCardHeader';
import ContestCardStats from './contest-card/ContestCardStats';
import ContestCardToggles from './contest-card/ContestCardToggles';
import ContestStatusBadge from './contest-card/ContestStatusBadge';
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Flame, Sparkles, Gift, Crown } from 'lucide-react';
import ContestCardPrize from './contest-card/ContestCardPrize';

interface Prize {
  id: string;
  name: string;
  description: string;
  image_url: string;
  shop_url: string;
  value: number;
}

interface ContestCardProps {
  contest: {
    id: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    draw_date: string;
    status: string;
    is_featured: boolean;
    is_new: boolean;
    has_big_prizes: boolean;
    is_exclusive: boolean;
    is_limited: boolean;
    is_vip: boolean;
    participants_count: number;
    questions_count: number;
    prizes: Prize[];
  };
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onFeatureToggle: (id: string, featured: boolean) => void;
  onStatusUpdate: (id: string, updates: { 
    is_new?: boolean; 
    has_big_prizes?: boolean;
    is_exclusive?: boolean;
    is_limited?: boolean;
    is_vip?: boolean;
  }) => void;
}

const ContestCard = ({
  contest,
  onSelect,
  onEdit,
  onArchive,
  onDelete,
  onFeatureToggle,
  onStatusUpdate
}: ContestCardProps) => {
  return (
    <Card className="tropical-card relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <ContestCardHeader
          title={contest.title}
          onSelect={onSelect}
          onEdit={onEdit}
          onArchive={onArchive}
          onDelete={onDelete}
          contestId={contest.id}
          status={contest.status}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <ContestStatusBadge status={contest.status} />
          
          {contest.is_new && (
            <Badge variant="secondary" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center gap-1">
              <Star className="w-3 h-3" />
              Nouveau
            </Badge>
          )}
          
          {contest.has_big_prizes && (
            <Badge variant="secondary" className="bg-gradient-to-r from-rose-500 to-pink-500 text-white flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              Gros lots
            </Badge>
          )}

          {contest.is_exclusive && (
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white flex items-center gap-1">
              <Crown className="w-3 h-3" />
              Exclusif
            </Badge>
          )}

          {contest.is_limited && (
            <Badge variant="secondary" className="bg-gradient-to-r from-red-500 to-orange-500 text-white flex items-center gap-1">
              <Flame className="w-3 h-3" />
              Édition limitée
            </Badge>
          )}

          {contest.is_vip && (
            <Badge variant="secondary" className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              VIP
            </Badge>
          )}

          {contest.is_featured && (
            <Badge variant="secondary" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center gap-1">
              <Gift className="w-3 h-3" />
              En vedette
            </Badge>
          )}
        </div>

        <p className="text-sm text-gray-500">{contest.description}</p>

        <ContestCardStats
          participantsCount={contest.participants_count}
          questionsCount={contest.questions_count}
          endDate={contest.end_date}
        />

        <ContestCardToggles
          contestId={contest.id}
          isFeatured={contest.is_featured}
          isNew={contest.is_new}
          hasBigPrizes={contest.has_big_prizes}
          isExclusive={contest.is_exclusive}
          isLimited={contest.is_limited}
          isVip={contest.is_vip}
          onFeatureToggle={onFeatureToggle}
          onStatusUpdate={onStatusUpdate}
        />

        <ContestCardPrize contestId={contest.id} />
      </CardContent>
    </Card>
  );
};

export default ContestCard;