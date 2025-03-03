
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import UserFilter from './UserFilter';
import UsersTable from './UsersTable';

const UserManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [displayMode, setDisplayMode] = useState<'all' | 'top10' | 'top25'>('all');

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('*')
        .order('total_points', { ascending: false });
      
      if (membersError) throw membersError;

      const { data: points, error: pointsError } = await supabase
        .from('user_points')
        .select('*');

      if (pointsError) throw pointsError;

      return members.map((member, index) => ({
        ...member,
        rank: index + 1,
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
          current_rank: 'NOVATO',
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

  const getDisplayedUsers = () => {
    if (!users) return [];
    switch (displayMode) {
      case 'top10':
        return users.slice(0, 10);
      case 'top25':
        return users.slice(0, 25);
      default:
        return users;
    }
  };

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
        <UserFilter 
          displayMode={displayMode} 
          onDisplayModeChange={setDisplayMode} 
        />
      </div>

      <UsersTable 
        users={getDisplayedUsers()}
        onResetPoints={(userId) => resetPointsMutation.mutate(userId)}
        onAddParticipation={(userId) => addParticipationMutation.mutate(userId)}
      />
    </div>
  );
};

export default UserManager;
