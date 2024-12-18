import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ContestCardHeader from './contest-card/ContestCardHeader';
import ContestCardStats from './contest-card/ContestCardStats';
import ContestCardToggles from './contest-card/ContestCardToggles';
import ContestCardBadges from './contest-card/ContestCardBadges';
import ContestCardPrize from './contest-card/ContestCardPrize';
import ContestStatusBadge from './contest-card/ContestStatusBadge';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ContestCardProps {
  contest: {
    id: string;
    title: string;
    description?: string;
    status: string;
    start_date: string;
    end_date: string;
    is_featured: boolean;
    is_new: boolean;
    has_big_prizes: boolean;
    shop_url?: string;
    prize_image_url?: string;
    participants?: { count: number };
    questions?: { count: number };
  };
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onFeatureToggle: (id: string, featured: boolean) => void;
  onStatusUpdate: (id: string, updates: { is_new?: boolean; has_big_prizes?: boolean; status?: string }) => void;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
}

const ContestCard = ({ 
  contest, 
  onDelete, 
  onArchive, 
  onFeatureToggle,
  onStatusUpdate,
  onSelect,
  onEdit,
}: ContestCardProps) => {
  const endDate = new Date(contest.end_date);
  const isExpiringSoon = endDate.getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000;

  const handleStatusToggle = (checked: boolean) => {
    onStatusUpdate(contest.id, { status: checked ? 'active' : 'draft' });
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow ${contest.status === 'archived' ? 'opacity-60' : ''}`}>
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
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <ContestStatusBadge status={contest.status} />
            {contest.status !== 'archived' && (
              <div className="flex items-center space-x-2">
                <Label htmlFor={`status-${contest.id}`} className="text-sm">
                  {contest.status === 'draft' ? 'Activer' : 'Désactiver'}
                </Label>
                <Switch
                  id={`status-${contest.id}`}
                  checked={contest.status === 'active'}
                  onCheckedChange={handleStatusToggle}
                />
              </div>
            )}
          </div>

          {contest.description && (
            <p className="text-gray-600 text-sm">{contest.description}</p>
          )}
          
          <ContestCardBadges
            isNew={contest.is_new}
            isExpiringSoon={isExpiringSoon}
            hasBigPrizes={contest.has_big_prizes}
          />
          
          <ContestCardPrize
            prizeImageUrl={contest.prize_image_url}
            shopUrl={contest.shop_url}
            contestId={contest.id}
          />
          
          <ContestCardStats
            participantsCount={contest.participants?.count || 0}
            questionsCount={contest.questions?.count || 0}
            endDate={contest.end_date}
          />

          <div className="space-y-2 pt-4 border-t">
            <ContestCardToggles
              contestId={contest.id}
              isFeatured={contest.is_featured}
              isNew={contest.is_new}
              hasBigPrizes={contest.has_big_prizes}
              onFeatureToggle={onFeatureToggle}
              onStatusUpdate={onStatusUpdate}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContestCard;