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
import { Button } from "@/components/ui/button";
import { Trophy, Users } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../App";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";

interface ContestCardProps {
  contest: {
    id: string;
    title: string;
    description?: string;
    status: string;
    start_date: string;
    end_date: string;
    draw_date: string;
    is_featured: boolean;
    is_new: boolean;
    has_big_prizes: boolean;
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
  const drawDate = contest.draw_date ? new Date(contest.draw_date) : null;
  const isExpiringSoon = endDate.getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000;
  const canDraw = drawDate && new Date() >= drawDate;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: winners } = useQuery({
    queryKey: ['contest-winners', contest.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('contest_id', contest.id)
        .eq('status', 'winner');
      
      if (error) throw error;
      return data;
    },
    enabled: !!contest.id
  });

  const handleStatusToggle = (checked: boolean) => {
    onStatusUpdate(contest.id, { status: checked ? 'active' : 'draft' });
  };

  const handleEndContestAndDraw = async () => {
    try {
      // Mettre à jour la date de fin et la date de tirage au sort
      const now = new Date().toISOString();
      const { error: updateError } = await supabase
        .from('contests')
        .update({ 
          end_date: now,
          draw_date: now,
          status: 'completed'
        })
        .eq('id', contest.id);

      if (updateError) throw updateError;

      // Sélectionner un gagnant parmi les participants éligibles (score >= 70%)
      const { data: eligibleParticipants, error: participantsError } = await supabase
        .from('participants')
        .select('*')
        .eq('contest_id', contest.id)
        .gte('score', 70);

      if (participantsError) throw participantsError;

      if (!eligibleParticipants?.length) {
        toast({
          title: "Aucun gagnant possible",
          description: "Aucun participant n'a obtenu un score suffisant (minimum 70%)",
          variant: "destructive",
        });
        return;
      }

      // Sélectionner un gagnant au hasard
      const winner = eligibleParticipants[Math.floor(Math.random() * eligibleParticipants.length)];

      // Mettre à jour le statut du gagnant
      const { error: winnerError } = await supabase
        .from('participants')
        .update({ status: 'winner' })
        .eq('id', winner.id);

      if (winnerError) throw winnerError;

      // Rafraîchir les données
      await queryClient.invalidateQueries({ queryKey: ['contests'] });
      await queryClient.invalidateQueries({ queryKey: ['contest-winners', contest.id] });

      toast({
        title: "Concours terminé",
        description: `Le gagnant est ${winner.first_name} ${winner.last_name} avec un score de ${winner.score}%`,
      });
    } catch (error) {
      console.error('Error ending contest:', error);
      toast({
        title: "Erreur",
        description: "Impossible de terminer le concours",
        variant: "destructive",
      });
    }
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
            contestId={contest.id}
          />
          
          <ContestCardStats
            participantsCount={contest.participants?.count || 0}
            questionsCount={contest.questions?.count || 0}
            endDate={contest.end_date}
          />

          {contest.status === 'active' && (
            <Button 
              onClick={handleEndContestAndDraw}
              className="w-full bg-amber-500 hover:bg-amber-600"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Terminer et tirer au sort maintenant
            </Button>
          )}

          {drawDate && (
            <div className="pt-2 border-t">
              <p className="text-sm text-gray-600 mb-2">
                Date du tirage : {format(drawDate, 'dd MMMM yyyy', { locale: fr })}
              </p>
              {winners && winners.length > 0 && (
                <div className="bg-amber-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-amber-600" />
                    <h4 className="font-semibold text-amber-900">Gagnants</h4>
                  </div>
                  <div className="space-y-2">
                    {winners.map((winner) => (
                      <div key={winner.id} className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-amber-600" />
                        <span>{winner.first_name} {winner.last_name}</span>
                        <span className="text-amber-600">({winner.score}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

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