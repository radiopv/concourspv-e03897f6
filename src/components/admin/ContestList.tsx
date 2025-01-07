import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Edit2, Trash2, Users } from "lucide-react";
import { Link } from "react-router-dom";
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
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "../../App";
import { useToast } from "@/components/ui/use-toast";

interface Contest {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  status: string;
  questionnaires?: { count: number };
  responses?: { count: number };
}

interface ContestListProps {
  contests: Contest[];
  onSelectContest: (id: string) => void;
}

const ContestList = ({ contests, onSelectContest }: ContestListProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteContestMutation = useMutation({
    mutationFn: async (contestId: string) => {
      const { error } = await supabase
        .from('contests')
        .delete()
        .eq('id', contestId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      toast({
        title: "Succès",
        description: "Le concours a été supprimé",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le concours",
        variant: "destructive",
      });
    }
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Liste des concours</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contests.map((contest) => (
          <Card key={contest.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold cursor-pointer hover:text-primary transition-colors" onClick={() => onSelectContest(contest.id)}>
                {contest.title}
              </CardTitle>
              <Badge variant={contest.status === 'active' ? 'default' : 'secondary'}>
                {contest.status === 'active' ? 'Actif' : 'Brouillon'}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contest.description && (
                  <p className="text-sm text-gray-600">{contest.description}</p>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <p className="font-medium">Questions</p>
                    <p>{contest.questionnaires?.count || 0}</p>
                  </div>
                  <div>
                    <p className="font-medium">Réponses</p>
                    <p>{contest.responses?.count || 0}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-medium">Dates</p>
                    <p>
                      Du {format(new Date(contest.start_date), 'dd MMMM yyyy', { locale: fr })}
                      <br />
                      au {format(new Date(contest.end_date), 'dd MMMM yyyy', { locale: fr })}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Link to={`/admin/contests/${contest.id}/participants`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Users className="w-4 h-4 mr-2" />
                      Participants
                    </Button>
                  </Link>
                  <Button variant="outline" size="icon" onClick={() => onSelectContest(contest.id)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action est irréversible. Le concours et toutes ses données seront supprimés.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteContestMutation.mutate(contest.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContestList;