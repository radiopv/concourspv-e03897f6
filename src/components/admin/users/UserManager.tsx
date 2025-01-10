import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserEditDialog } from './UserEditDialog';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const UserManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // First, get all members
      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('*');
      
      if (membersError) throw membersError;

      // Then, get their points
      const { data: points, error: pointsError } = await supabase
        .from('user_points')
        .select('*');

      if (pointsError) throw pointsError;

      // Combine the data
      return members.map(member => ({
        ...member,
        user_points: points.filter(p => p.user_id === member.id)
      }));
    }
  });

  const resetPointsMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('user_points')
        .update({
          total_points: 0,
          current_streak: 0,
          best_streak: 0,
          current_rank: 'BEGINNER',
          extra_participations: 0
        })
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Succès",
        description: "Les points ont été réinitialisés",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de réinitialiser les points",
        variant: "destructive",
      });
    }
  });

  const addParticipationMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase
        .from('user_points')
        .select('extra_participations')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      const { error: updateError } = await supabase
        .from('user_points')
        .update({
          extra_participations: (data.extra_participations || 0) + 1
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Succès",
        description: "Une participation supplémentaire a été ajoutée",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter une participation",
        variant: "destructive",
      });
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des utilisateurs</h2>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Rang</TableHead>
              <TableHead>Participations Extra</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {user.first_name} {user.last_name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.user_points?.[0]?.total_points || 0}</TableCell>
                <TableCell>{user.user_points?.[0]?.current_rank || 'BEGINNER'}</TableCell>
                <TableCell>{user.user_points?.[0]?.extra_participations || 0}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <UserEditDialog user={user} />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resetPointsMutation.mutate(user.id)}
                    >
                      Réinitialiser
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addParticipationMutation.mutate(user.id)}
                    >
                      +1 Participation
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManager;
