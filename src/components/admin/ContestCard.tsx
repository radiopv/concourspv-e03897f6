
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Contest } from "@/types/contest";
import ContestCardHeader from './contest-card/ContestCardHeader';
import ContestCardStats from './contest-card/ContestCardStats';
import ContestCardBadges from './contest-card/ContestCardBadges';
import ContestCardToggles from './contest-card/ContestCardToggles';
import ContestCardPrize from './contest-card/ContestCardPrize';
import ContestDraw from './contest-card/ContestDraw';
import ContestParticipants from './contest-card/ContestParticipants';
import { useContestMutations } from './hooks/useContestMutations';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import { Calendar } from "lucide-react";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";

interface ContestCardProps {
  contest: Contest;
  onSelectContest: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ContestCard = ({ contest, onSelectContest, onEdit, onDelete }: ContestCardProps) => {
  const { statusUpdateMutation } = useContestMutations();
  const [isEditingDates, setIsEditingDates] = useState(false);
  const [startDate, setStartDate] = useState(contest.start_date?.split('T')[0] || '');
  const [endDate, setEndDate] = useState(contest.end_date?.split('T')[0] || '');
  const { toast } = useToast();

  const handleDateUpdate = async () => {
    try {
      await statusUpdateMutation.mutateAsync({
        id: contest.id,
        updates: {
          start_date: startDate,
          end_date: endDate
        }
      });
      setIsEditingDates(false);
      toast({
        title: "Dates mises à jour",
        description: "Les dates du concours ont été modifiées avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les dates.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <ContestCardHeader 
          title={contest.title}
          contestId={contest.id}
          onSelect={onSelectContest}
          onEdit={onEdit || onSelectContest}
          onArchive={(id) => statusUpdateMutation.mutate({ id, updates: { status: 'archived' }})}
          onDelete={onDelete || (() => {})}
          status={contest.status}
        />
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            {isEditingDates ? (
              <div className="flex items-center space-x-2">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-40"
                />
                <span>au</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-40"
                />
                <Button onClick={handleDateUpdate} size="sm">
                  Sauvegarder
                </Button>
                <Button 
                  onClick={() => setIsEditingDates(false)} 
                  variant="outline" 
                  size="sm"
                >
                  Annuler
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Du {format(new Date(contest.start_date), 'dd/MM/yyyy')} au{' '}
                  {format(new Date(contest.end_date), 'dd/MM/yyyy')}
                </span>
                <Button 
                  onClick={() => setIsEditingDates(true)} 
                  variant="outline" 
                  size="sm"
                >
                  Modifier
                </Button>
              </div>
            )}
          </div>
          <ContestCardBadges 
            isNew={contest.is_new}
            hasBigPrizes={contest.has_big_prizes}
            isFeatured={contest.is_featured}
            isExclusive={contest.is_exclusive}
            isLimited={contest.is_limited}
            isVip={contest.is_vip}
          />
        </div>
        <ContestCardToggles
          contestId={contest.id}
          isFeatured={contest.is_featured}
          isNew={contest.is_new}
          hasBigPrizes={contest.has_big_prizes}
          isExclusive={contest.is_exclusive}
          isLimited={contest.is_limited}
          isVip={contest.is_vip}
          onFeatureToggle={(id, featured) => 
            statusUpdateMutation.mutate({ id, updates: { is_featured: featured }})
          }
          onStatusUpdate={(id, updates) => 
            statusUpdateMutation.mutate({ id, updates })
          }
        />
      </CardHeader>

      <CardContent className="space-y-6">
        <ContestCardStats 
          participantsCount={contest.participants?.count || 0}
          questionsCount={contest.questions?.count || 0}
          endDate={contest.end_date}
        />
        <ContestParticipants 
          contestId={contest.id}
          onSelectContest={onSelectContest}
          participantsCount={contest.participants?.count || 0}
        />
        <ContestCardPrize 
          contestId={contest.id}
          prizes={contest.prizes || []}
        />
        <ContestDraw 
          contestId={contest.id}
          drawDate={contest.draw_date}
          status={contest.status}
        />
      </CardContent>
    </Card>
  );
};

export default ContestCard;
