import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ContestCardHeader from './contest-card/ContestCardHeader';
import ContestCardStats from './contest-card/ContestCardStats';
import ContestCardToggles from './contest-card/ContestCardToggles';
import ContestCardBadges from './contest-card/ContestCardBadges';
import ContestCardPrize from './contest-card/ContestCardPrize';
import ContestStatusBadge from './contest-card/ContestStatusBadge';
import ContestDrawSection from './contest-card/ContestDrawSection';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../App";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
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

  // Updated query to get participants through participations table
  const { data: participations } = useQuery({
    queryKey: ['contest-participations', contest.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participations')
        .select(`
          id,
          score,
          status,
          completed_at,
          participant:participants (
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('contest_id', contest.id)
        .order('score', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: showParticipants
  });

  // Updated query to get questions through questionnaires table
  const { data: questions } = useQuery({
    queryKey: ['contest-questions', contest.id],
    queryFn: async () => {
      const { data: questionnaire } = await supabase
        .from('questionnaires')
        .select('id')
        .eq('contest_id', contest.id)
        .single();

      if (!questionnaire) return [];

      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('questionnaire_id', questionnaire.id);
      
      if (error) throw error;
      return data;
    }
  });

  // Get winners from participations
  const winners = participations?.filter(p => p.status === 'winner') || [];

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
            contestId={contest.id}
          />
          
          <ContestCardStats
            participantsCount={participations?.length || 0}
            questionsCount={questions?.length || 0}
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
                Voir les participants ({participations?.length || 0})
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
                  {participations?.map((participation) => (
                    <TableRow key={participation.id}>
                      <TableCell>{participation.participant.first_name}</TableCell>
                      <TableCell>{participation.participant.last_name}</TableCell>
                      <TableCell>{participation.score}%</TableCell>
                      <TableCell>
                        <CustomBadge variant={participation.status === 'winner' ? "success" : "secondary"}>
                          {participation.status === 'winner' ? 'Gagnant' : 'Participant'}
                        </CustomBadge>
                      </TableCell>
                      <TableCell>
                        {participation.completed_at
                          ? format(new Date(participation.completed_at), 'dd MMMM yyyy', { locale: fr })
                          : 'Non complété'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DialogContent>
          </Dialog>

          <ContestDrawSection 
            contestId={contest.id}
            status={contest.status}
            drawDate={drawDate}
            winners={winners}
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