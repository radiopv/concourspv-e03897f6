import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import ContestCardHeader from './contest-card/ContestCardHeader';
import ContestCardStats from './contest-card/ContestCardStats';
import ContestCardToggles from './contest-card/ContestCardToggles';
import ContestCardBadges from './contest-card/ContestCardBadges';
import ContestCardPrize from './contest-card/ContestCardPrize';
import ContestStatusBadge from './contest-card/ContestStatusBadge';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Trophy, Users, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../App";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
  const { toast } = useToast();
  const endDate = new Date(contest.end_date);
  const drawDate = contest.draw_date ? new Date(contest.draw_date) : null;
  const isExpiringSoon = endDate.getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000;
  const canDraw = drawDate && new Date() >= drawDate;

  const { data: winners } = useQuery({
    queryKey: ['contest-winners', contest.id],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('contest_id', contest.id)
        .eq('status', 'winner');
      
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les gagnants",
          variant: "destructive",
        });
        throw error;
      }
      return data;
    },
    enabled: !!contest.id,
    retry: 1,
  });

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

          {contest.prize_image_url && (
            <div className="relative group">
              <img 
                src={contest.prize_image_url} 
                alt="Prix à gagner"
                className="w-full h-48 object-cover rounded-lg"
              />
              {contest.shop_url && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <a
                    href={contest.shop_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Voir sur la boutique
                  </a>
                </div>
              )}
            </div>
          )}
          
          <ContestCardPrize
            contestId={contest.id}
          />
          
          <ContestCardStats
            participantsCount={contest.participants?.count || 0}
            questionsCount={contest.questions?.count || 0}
            endDate={contest.end_date}
          />

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