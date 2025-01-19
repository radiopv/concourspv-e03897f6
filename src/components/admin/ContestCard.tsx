import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, List, RefreshCw, BookOpen } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import ParticipantInfo from './participants/ParticipantInfo';
import ParticipantsList from './ParticipantsList';
import { useContestMutations } from './hooks/useContestMutations';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const [showParticipants, setShowParticipants] = React.useState(false);
  const { resetContestMutation } = useContestMutations();

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

  const handleReset = () => {
    resetContestMutation.mutate(contest.id);
  };

  return (
    <Card className="w-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
        <CardTitle className="text-2xl font-bold text-gray-800">{contest.title}</CardTitle>
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
      <CardContent className="pt-6">
        <div className="space-y-6">
          {contest.description && (
            <p className="text-gray-600 text-base leading-relaxed">
              {contest.description}
            </p>
          )}
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Participants</h3>
              <p className="text-2xl font-bold text-primary">
                {participantsData?.total || 0}
              </p>
              {participantsData?.total > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Taux de réussite: {participantsData.successRate}%
                </p>
              )}
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Questions</h3>
              <p className="text-2xl font-bold text-primary">
                {questionsCount || 0}
              </p>
            </div>
          </div>

          {userId && (
            <ParticipantInfo 
              userId={userId} 
              contestId={contest.id}
            />
          )}

          <div className="flex flex-wrap gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate(`/admin/contests/${contest.id}/questions`)}
              className="hover:bg-blue-50"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Gérer les questions
            </Button>
            {onEdit && (
              <Button
                variant="outline"
                onClick={() => onEdit(contest.id)}
                className="hover:bg-gray-100"
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setShowParticipants(!showParticipants)}
              className="hover:bg-gray-100"
            >
              <List className="h-4 w-4 mr-2" />
              Participants
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="hover:bg-red-100"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réinitialiser
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Réinitialiser le concours ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action supprimera toutes les participations de ce concours. Cette action est irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset}>Réinitialiser</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {onDelete && (
              <Button
                variant="destructive"
                onClick={() => onDelete(contest.id)}
                className="hover:bg-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            )}
          </div>

          {showParticipants && (
            <div className="mt-6">
              <ParticipantsList contestId={contest.id} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContestCard;
