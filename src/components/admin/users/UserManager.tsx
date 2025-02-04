import React, { useState } from 'react';
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
import { Loader2, Trophy, Medal, Award, Crown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RANK_POINTS } from '@/constants/ranks';

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

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-700" />;
      default:
        return <Award className="h-6 w-6 text-blue-500" />;
    }
  };

  const getNextRankInfo = (currentPoints: number, currentRank: string) => {
    const ranks = Object.entries(RANK_POINTS).sort((a, b) => a[1] - b[1]);
    const nextRank = ranks.find(([_, points]) => points > currentPoints);
    if (nextRank) {
      return {
        rank: nextRank[0],
        pointsNeeded: nextRank[1] - currentPoints
      };
    }
    return null;
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
        <Select
          value={displayMode}
          onValueChange={(value: 'all' | 'top10' | 'top25') => setDisplayMode(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Afficher..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les joueurs</SelectItem>
            <SelectItem value="top10">Top 10 🏆</SelectItem>
            <SelectItem value="top25">Top 25 🔥</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Position</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Rang Actuel</TableHead>
              <TableHead>Prochain Rang</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getDisplayedUsers().map((user, index) => {
              const nextRankInfo = getNextRankInfo(
                user.total_points,
                user.user_points?.[0]?.current_rank || 'NOVATO'
              );
              
              return (
                <TableRow 
                  key={user.id}
                  className={index < 3 ? 'bg-gradient-to-r from-amber-50 to-amber-100' : ''}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getRankIcon(index + 1)}
                      {index + 1}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="font-bold text-indigo-600">
                    {user.total_points}
                  </TableCell>
                  <TableCell>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-amber-100 to-amber-200">
                      {user.user_points?.[0]?.current_rank || 'NOVATO'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {nextRankInfo ? (
                      <span className="text-sm text-gray-600">
                        {nextRankInfo.pointsNeeded} points pour {nextRankInfo.rank}
                      </span>
                    ) : (
                      <span className="text-sm text-emerald-600 font-medium">
                        Rang maximal atteint !
                      </span>
                    )}
                  </TableCell>
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
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManager;