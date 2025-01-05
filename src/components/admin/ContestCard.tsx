import React, { useState } from 'react';
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
import { useToast } from "@/hooks/use-toast";
import { drawService } from './services/drawService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomBadge } from "@/components/ui/custom-badge";

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
  const [showParticipants, setShowParticipants] = useState(false);
  const endDate = new Date(contest.end_date);
  const drawDate = contest.draw_date ? new Date(contest.draw_date) : null;
  const isExpiringSoon = endDate.getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: winners, error: winnersError } = useQuery({
    queryKey: ['contest-winners', contest.id],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Session expired - please login again");
      }

      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('contest_id', contest.id)
        .eq('status', 'winner');
      
      if (error) throw error;
      return data;
    },
    enabled: !!contest.id,
    retry: 1
  });

  const { data: participants, error: participantsError } = useQuery({
    queryKey: ['contest-participants', contest.id],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Session expired - please login again");
      }

      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('contest_id', contest.id)
        .order('score', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: showParticipants,
    retry: 1
  });

  // Handle any auth errors
  React.useEffect(() => {
    if (winnersError || participantsError) {
      const error = winnersError || participantsError;
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
    }
  }, [winnersError, participantsError, toast]);

  const handleStatusToggle = (checked: boolean) => {
    onStatusUpdate(contest.id, { status: checked ? 'active' : 'draft' });
  };

  const handleEndContestAndDraw = async () => {
    try {
      const winner = await drawService.endContestAndDraw(contest.id, queryClient);
      toast({
        title: "Concours terminé",
        description: `Le gagnant est ${winner.first_name} ${winner.last_name} avec un score de ${winner.score}%`,
      });
    } catch (error) {
      console.error('Error ending contest:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de terminer le concours",
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

          <Dialog open={showParticipants} onOpenChange={setShowParticipants}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowParticipants(true)}
              >
                <Users className="w-4 h-4 mr-2" />
                Voir les participants ({contest.participants?.count || 0})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Participants au concours</DialogTitle>
              </DialogHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prénom</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date de participation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants?.map((participant) => (
                    <TableRow key={participant.id}>
                      <TableCell>{participant.first_name}</TableCell>
                      <TableCell>{participant.last_name}</TableCell>
                      <TableCell>{participant.score}%</TableCell>
                      <TableCell>
                        <CustomBadge variant={participant.status === 'winner' ? "success" : "secondary"}>
                          {participant.status === 'winner' ? 'Gagnant' : 'Participant'}
                        </CustomBadge>
                      </TableCell>
                      <TableCell>
                        {participant.completed_at
                          ? format(new Date(participant.completed_at), 'dd MMMM yyyy', { locale: fr })
                          : 'Non complété'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DialogContent>
          </Dialog>

          {contest.status === 'active' && (
            <Button 
              onClick={handleEndContestAndDraw}
              className="w-full bg-amber-500 hover:bg-amber-600"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Terminer et tirer au sort maintenant
            </Button>
          )}

          {drawDate && winners && winners.length > 0 && (
            <div className="pt-2 border-t">
              <p className="text-sm text-gray-600 mb-2">
                Date du tirage : {format(drawDate, 'dd MMMM yyyy', { locale: fr })}
              </p>
              <div className="bg-amber-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-600" />
                  <h4 className="font-semibold text-amber-900">Gagnants</h4>
                </div>
                {winners.map((winner) => (
                  <div key={winner.id} className="mt-2 text-sm text-amber-800">
                    {winner.first_name} {winner.last_name} ({winner.score}%)
                  </div>
                ))}
              </div>
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