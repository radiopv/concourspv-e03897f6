import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, List } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import ParticipantInfo from './participants/ParticipantInfo';

interface ContestCardProps {
  contest: {
    id: string;
    title: string;
    description?: string;
    status?: string;
    participants_count?: number;
    questions_count?: number;
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ContestCard = ({ contest, onEdit, onDelete }: ContestCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
          <div className="flex justify-between text-sm">
            <span>Participants: {contest.participants_count || 0}</span>
            <span>Questions: {contest.questions_count || 0}</span>
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