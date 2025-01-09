import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Edit2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserEditDialogProps {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role?: string;
    user_points?: Array<{
      total_points: number;
      current_streak: number;
      best_streak: number;
      current_rank: string;
      extra_participations: number;
    }>;
  };
}

export const UserEditDialog = ({ user }: UserEditDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    ...user,
    total_points: user.user_points?.[0]?.total_points || 0,
    current_streak: user.user_points?.[0]?.current_streak || 0,
    best_streak: user.user_points?.[0]?.best_streak || 0,
    current_rank: user.user_points?.[0]?.current_rank || 'BEGINNER',
    extra_participations: user.user_points?.[0]?.extra_participations || 0,
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Mise à jour du membre
      const { error: memberError } = await supabase
        .from('members')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          role: data.role,
        })
        .eq('id', user.id);
      
      if (memberError) throw memberError;

      // Mise à jour des points
      const { error: pointsError } = await supabase
        .from('user_points')
        .update({
          total_points: data.total_points,
          current_streak: data.current_streak,
          best_streak: data.best_streak,
          current_rank: data.current_rank,
          extra_participations: data.extra_participations,
        })
        .eq('user_id', user.id);

      if (pointsError) throw pointsError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Succès",
        description: "Les informations ont été mises à jour",
      });
      setIsOpen(false);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les informations",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="first_name" className="text-right">
                Prénom
              </Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="last_name" className="text-right">
                Nom
              </Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Rôle
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Utilisateur</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="points" className="text-right">
                Points
              </Label>
              <Input
                id="points"
                type="number"
                value={formData.total_points}
                onChange={(e) => setFormData({ ...formData, total_points: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="streak" className="text-right">
                Série
              </Label>
              <Input
                id="streak"
                type="number"
                value={formData.current_streak}
                onChange={(e) => setFormData({ ...formData, current_streak: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="best_streak" className="text-right">
                Meilleure série
              </Label>
              <Input
                id="best_streak"
                type="number"
                value={formData.best_streak}
                onChange={(e) => setFormData({ ...formData, best_streak: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rank" className="text-right">
                Rang
              </Label>
              <Select
                value={formData.current_rank}
                onValueChange={(value) => setFormData({ ...formData, current_rank: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un rang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINNER">Débutant</SelectItem>
                  <SelectItem value="BRONZE">Bronze</SelectItem>
                  <SelectItem value="SILVER">Argent</SelectItem>
                  <SelectItem value="GOLD">Or</SelectItem>
                  <SelectItem value="MASTER">Maître</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="participations" className="text-right">
                Participations
              </Label>
              <Input
                id="participations"
                type="number"
                value={formData.extra_participations}
                onChange={(e) => setFormData({ ...formData, extra_participations: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};