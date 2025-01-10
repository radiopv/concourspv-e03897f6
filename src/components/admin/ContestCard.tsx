import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, List } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import ParticipantInfo from './participants/ParticipantInfo';

interface ContestCardProps {
  contest: {
    id: string;
    title: string;
    description?: string;
    status?: string;
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ContestCard = ({ contest, onEdit, onDelete }: ContestCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch participants count and success rate
  const { data: participantsData } = useQuery({
    queryKey: ['contest-participants', contest.id],
    queryFn: async () => {
      const { data: participants, error } = await supabase
        .from('participants')
        .select('*')
        .eq('contest_id', contest.id);

      if (error) throw error;

      const completedParticipants = participants?.filter(p => p.status === 'completed') || [];
      const successfulParticipants = completedParticipants.filter(p => (p.score || 0) >= 90) || [];
      
      return {
        total: participants?.length || 0,
        successRate: completedParticipants.length > 0 
          ? Math.round((successfulParticipants.length / completedParticipants.length) * 100) 
          : 0
      };
    }
  });

  // Fetch questions count
  const { data: questionsCount } = useQuery({
    queryKey: ['contest-questions', contest.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('contest_id', contest.id);

      if (error) throw error;
      return count || 0;
    }
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500 hover:bg-green-600';
      case 'draft':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'archived':
        return 'bg-gray-500 hover:bg-gray-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'draft':
        return 'Brouillon';
      case 'archived':
        return 'Archivé';
      default:
        return 'Inconnu';
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contests')
        .update({ status: newStatus })
        .eq('id', contest.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['contests'] });
      
      toast({
        title: "Statut mis à jour",
        description: `Le concours est maintenant ${getStatusLabel(newStatus).toLowerCase()}`,
      });
    } catch (error) {
      console.error('Error updating contest status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  // Get the current user's ID from Supabase session
  const [userId, setUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    };
    getSession();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{contest.title}</CardTitle>
        <Select
          defaultValue={contest.status}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue>
              <Badge className={getStatusColor(contest.status)}>
                {getStatusLabel(contest.status)}
              </Badge>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Brouillon</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="archived">Archivé</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">{contest.description}</p>
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Participants:</span>
              <p>{participantsData?.total || 0}</p>
              {participantsData?.total > 0 && (
                <p className="text-xs text-gray-500">
                  Taux de réussite: {participantsData.successRate}%
                </p>
              )}
            </div>
            <div>
              <span className="font-medium">Questions:</span>
              <p>{questionsCount || 0}</p>
            </div>
          </div>
          
          {userId && (
            <ParticipantInfo 
              userId={userId} 
              contestId={contest.id}
            />
          )}

          <div className="flex justify-end space-x-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(contest.id)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/admin/contests/${contest.id}/participants`)}
            >
              <List className="h-4 w-4 mr-2" />
              Participants
            </Button>
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(contest.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContestCard;