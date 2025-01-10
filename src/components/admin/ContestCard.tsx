import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ContestCardHeader from './contest-card/ContestCardHeader';
import ContestCardStats from './contest-card/ContestCardStats';
import ContestCardToggles from './contest-card/ContestCardToggles';
import ContestStatusBadge from './contest-card/ContestStatusBadge';
import ContestCardBadges from './contest-card/ContestCardBadges';
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
    participants_count: number;
    questions_count: number;
    prizes: Prize[];
  };
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onFeatureToggle: (id: string, featured: boolean) => void;
  onStatusUpdate: (id: string, updates: { is_new?: boolean; has_big_prizes?: boolean }) => void;
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
    <Card className="relative">
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
        <div className="flex items-center gap-2">
          <ContestStatusBadge status={contest.status} />
          <ContestCardBadges
            isNew={contest.is_new}
            hasBigPrizes={contest.has_big_prizes}
            isFeatured={contest.is_featured}
          />
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
          onFeatureToggle={onFeatureToggle}
          onStatusUpdate={onStatusUpdate}
        />

        <ContestCardPrize contestId={contest.id} />
      </CardContent>
    </Card>
  );
};

export default ContestCard;